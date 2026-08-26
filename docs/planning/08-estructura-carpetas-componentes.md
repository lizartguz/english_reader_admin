# Estructura de carpetas y componentes - English Reader Admin

## Objetivo

Este documento define la estructura interna de `english_reader_admin`.

La meta es evitar código espagueti, separar responsabilidades y facilitar crecimiento por módulos administrativos.

## Principio general

La estructura será modular por feature.

Cada módulo administrativo debe agrupar sus páginas, componentes, hooks, servicios, tipos y validaciones propias.

Lo compartido debe vivir en `core` o `shared`, no duplicarse por módulo.

## Estructura propuesta

```text
src/
  main.tsx
  app/
    App.tsx
    router/
      routes.tsx
      protected-route.tsx
      route-permissions.ts
    providers/
      app-providers.tsx
      query-provider.tsx
      auth-provider.tsx
    layouts/
      admin-layout.tsx
      auth-layout.tsx

  core/
    api/
      api-client.ts
      api-error.ts
      api-response.ts
      auth-interceptor.ts
    auth/
      auth-session.ts
      permission-checker.ts
      token-storage.ts
    config/
      env.ts
      constants.ts
    errors/
      friendly-error.ts
      error-mapper.ts
    permissions/
      permissions.enum.ts
      roles.enum.ts
    ui/
      modals/
      tables/
      forms/
      feedback/
      layout/
    utils/
      format-date.ts
      file-size.ts

  features/
    auth/
    dashboard/
    stories/
    reading-levels/
    users/
    roles/
    permissions/
    dictionary/
    translations/
    audit/
    system-logs/
    settings/
```

## Estructura por feature

```text
features/{feature}/
  api/
    {feature}.api.ts
  components/
  hooks/
  pages/
  schemas/
  types/
  utils/
```

Ejemplo:

```text
features/stories/
  api/
    stories.api.ts
  components/
    story-form-modal.tsx
    story-filters.tsx
    stories-table.tsx
    story-actions-dropdown.tsx
  hooks/
    use-stories-query.ts
    use-create-story.ts
    use-update-story.ts
  pages/
    stories-page.tsx
  schemas/
    story.schema.ts
  types/
    story.types.ts
```

## Componentes reutilizables

Componentes compartidos esperados:

- `DataTable`
- `TablePagination`
- `PageHeader`
- `FilterBar`
- `ActionDropdown`
- `ConfirmDialog`
- `FormModal`
- `FileUploadField`
- `StatusBadge`
- `PermissionGate`
- `EmptyState`
- `LoadingState`
- `ErrorState`
- `ProtectedRoute`
- `CircularLoader`
- `SessionExpiredModal`
- `AccessDeniedState`
- `AppFeedback`

## Reglas de reutilización

- Si un componente se repite en dos o más módulos, evaluar moverlo a `core/ui`.
- Si un componente depende de una entidad específica, debe quedarse en su feature.
- Los componentes compartidos no deben conocer reglas internas de un módulo concreto.
- Las páginas deben coordinar componentes, no contener lógica extensa.
- Las llamadas API deben estar en servicios/hooks, no dentro del JSX principal.

## Separación de responsabilidades

Páginas:

```text
coordinan layout, filtros, tabla, modales y estado visible
```

Hooks:

```text
conectan componentes con API, queries, mutaciones o estado reusable
```

Schemas:

```text
validan formularios con Zod
```

API services:

```text
centralizan llamadas HTTP por feature
```

Types:

```text
definen modelos TypeScript alineados con contratos API
```

## Regla anti espagueti

No se deben crear páginas enormes con:

- lógica API directa
- validaciones inline extensas
- modales completos dentro de la página
- columnas de tabla mezcladas con lógica compleja
- permisos hardcodeados en varios lugares
- strings de estados repetidos manualmente

Cada preocupación debe extraerse a su archivo correspondiente.

## Componentes de estado y feedback

Los estados comunes deben centralizarse para reutilizarse en todo el panel.

Componentes propuestos:

```text
CircularLoader       -> carga visual reutilizable
ButtonLoader         -> estado de botón mientras guarda o ejecuta una acción
SessionExpiredModal  -> modal de sesión expirada con cuenta regresiva
AccessDeniedState    -> vista de acceso denegado sin detalles técnicos
AppFeedback          -> mensaje reutilizable de éxito, error, advertencia o información
```

Estos componentes deben evitar duplicación de diseño y comportamiento entre módulos.

## Criterios de cierre

Este documento se considera suficiente cuando define:

- estructura base
- estructura por feature
- componentes reutilizables
- reglas de reutilización
- separación de responsabilidades
- reglas anti espagueti
