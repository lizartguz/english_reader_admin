# Estándares de código Admin - English Reader

## Objetivo

Este documento define estándares de código para futuras implementaciones de `english_reader_admin`.

La meta es mantener un código React/TypeScript legible, escalable y mantenible.

## TypeScript

Reglas:

- evitar `any` salvo justificación clara
- tipar respuestas API
- tipar props de componentes
- usar tipos compartidos por feature
- mantener DTOs/modelos alineados con la API

## Imports

Usar imports al inicio del archivo.

No usar rutas largas inline dentro de funciones o tipos.

Ejemplo recomendado:

```ts
import { Story } from '../types/story.types';

function StoryRow({ story }: { story: Story }) {}
```

Evitar:

```ts
function StoryRow({
  story,
}: {
  story: import('../types/story.types').Story;
}) {}
```

## Constantes y enums

No hardcodear valores reutilizables.

Centralizar:

- roles
- permisos
- estados
- rutas
- claves de query
- mensajes reutilizables
- límites de archivos
- tipos de archivo

Ejemplo:

```ts
export const AdminRoutes = {
  Stories: '/admin/stories',
  SystemLogs: '/admin/system-logs',
} as const;
```

## Componentes

Reglas:

- componentes pequeños y enfocados
- páginas coordinan, componentes renderizan
- lógica API en hooks o servicios
- formularios en componentes específicos
- tablas separadas por feature
- dropdowns de acciones separados
- no duplicar componentes comunes

## Hooks

Los hooks deben encapsular lógica reutilizable.

Ejemplos:

```text
useStoriesQuery
useCreateStory
useUpdateStory
useCurrentUser
usePermissions
```

No usar hooks para mezclar demasiadas responsabilidades.

## Servicios API

Cada feature debe tener servicios API propios.

Ejemplo:

```text
features/stories/api/stories.api.ts
```

Los servicios deben usar el cliente HTTP centralizado.

No hacer `axios.get` directamente dentro de componentes de página.

## Query keys

Las claves de TanStack Query deben centralizarse.

Ejemplo:

```ts
export const storiesKeys = {
  all: ['stories'] as const,
  list: (filters: StoryFilters) => ['stories', 'list', filters] as const,
  detail: (id: string) => ['stories', 'detail', id] as const,
};
```

## Comentarios

Usar comentarios breves en español solo cuando aporten claridad.

Comentar:

- lógica compleja
- reglas de permisos
- manejo de tokens
- decisiones de seguridad
- transformación no obvia de datos

Evitar comentarios que repitan lo evidente.

## Mensajes

Los mensajes reutilizables deben centralizarse.

No mostrar mensajes técnicos al usuario.

Se debe usar un componente centralizado para feedback visual.

Ejemplo conceptual:

```tsx
<AppFeedback
  type="success"
  title="Cambios guardados"
  description="La información se actualizó correctamente."
/>
```

Los textos reutilizables deben vivir en catálogos o constantes.

Ejemplo:

```ts
export const AdminMessages = {
  SessionExpiredTitle: 'Sesión expirada',
  SessionExpiredDescription: 'Tu sesión finalizó. Serás redirigido al inicio de sesión.',
  AccessDeniedTitle: 'Acceso denegado',
  ApiUnavailableTitle: 'Servidor no disponible',
} as const;
```

## Seguridad

El frontend debe:

- ocultar acciones no permitidas
- limpiar sesión cuando expire
- no exponer tokens en logs
- no mostrar rutas internas de archivos
- no confiar en permisos solo del cliente

La API siempre valida la autorización real.

## Estados de carga

Los estados de carga deben implementarse con componentes reutilizables.

No se deben crear spinners o loaders diferentes en cada pantalla.

Casos mínimos:

- carga inicial de página
- carga de tabla
- guardado de formulario
- eliminación o cambio de estado
- carga de archivos protegidos
- verificación de sesión

El componente puede ser circular, con texto accesible cuando la espera sea perceptible.

## Criterios de cierre

Este documento se considera suficiente cuando define:

- TypeScript
- imports
- constantes/enums
- componentes
- hooks
- servicios API
- query keys
- comentarios
- mensajes
- seguridad frontend
