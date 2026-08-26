# Librerías y dependencias Admin - English Reader

## Objetivo

Este documento define las librerías recomendadas para `english_reader_admin`.

La selección prioriza mantenibilidad, escalabilidad, seguridad, accesibilidad, reutilización de componentes y compatibilidad con React + TypeScript + Vite.

## Stack base existente

El proyecto fue creado con:

```text
React
TypeScript
Vite
ESLint
npm
```

## Librerías recomendadas

| Uso | Librería | Estado |
| --- | --- | --- |
| Rutas | `react-router` | Recomendada |
| Estado servidor/API | `@tanstack/react-query` | Recomendada |
| Tablas | `@tanstack/react-table` | Recomendada |
| Formularios | `react-hook-form` | Recomendada |
| Validación | `zod` + `@hookform/resolvers` | Recomendada |
| Cliente HTTP | `axios` | Recomendada |
| UI base | `shadcn/ui` | Recomendada |
| Estilos | `tailwindcss` | Recomendada |
| Iconos | `lucide-react` | Recomendada |
| Toasts/mensajes | `sonner` | Recomendada |
| Estado global pequeño | `zustand` | Opcional recomendado |
| E2E | `@playwright/test` | Aprobada |

## Criterios por librería

### React Router

Se usará para navegación SPA, rutas anidadas, layouts y rutas protegidas.

Referencia: https://reactrouter.com/

### TanStack Query

Se usará para estado del servidor:

- consultas API
- caché
- refetch
- mutaciones
- invalidación de listados después de crear/editar/eliminar

Referencia: https://tanstack.com/query/latest/docs/framework/react/overview

### TanStack Table

Se usará como motor headless para tablas administrativas.

Permite controlar completamente diseño, columnas, paginación, filtros, ordenamiento y acciones.

Referencia: https://tanstack.com/table/latest

### React Hook Form + Zod

Se usarán para formularios y validación en frontend.

React Hook Form administrará estado del formulario.

Zod definirá schemas de validación reutilizables.

Referencia React Hook Form: https://react-hook-form.com/docs/useform

Referencia Zod: https://zod.dev/

Referencia resolvers: https://github.com/react-hook-form/resolvers

### Axios

Se usará como cliente HTTP centralizado.

Debe permitir:

- base URL por ambiente
- headers comunes
- manejo de tokens
- interceptores de respuesta
- manejo centralizado de errores

Referencia interceptores: https://axios.rest/pages/advanced/interceptors

### shadcn/ui + Tailwind CSS

Se recomienda usar `shadcn/ui` como base de componentes accesibles y personalizables, junto con Tailwind CSS para estilos.

No se debe copiar código visual sin adaptarlo al patrón del proyecto.

Referencia shadcn/ui: https://ui.shadcn.com/docs

Referencia Tailwind con Vite: https://tailwindcss.com/docs

### lucide-react

Se usará para iconos en botones, menús, acciones, estados y herramientas.

Referencia: https://lucide.dev/guide/react/

### Sonner

Se usará para mensajes no bloqueantes como éxito, error y advertencia.

Los mensajes de confirmación destructiva deben usar modal, no toast.

Referencia: https://ui.shadcn.com/docs/components/radix/sonner

### Zustand

Puede usarse para estado global pequeño:

- sesión visual
- usuario autenticado
- permisos cargados
- estado del sidebar
- preferencias locales de UI

No debe reemplazar TanStack Query para datos del servidor.

Referencia: https://zustand.docs.pmnd.rs/

## Reglas de uso

- No instalar librerías duplicadas para el mismo problema.
- No usar librerías pesadas si una solución simple y mantenible basta.
- No mezclar varios sistemas de UI sin necesidad.
- No hacer llamadas API directas desde componentes de página.
- No manejar formularios complejos sin schema de validación.
- No usar estado global para datos que pertenecen al servidor.

## Pendientes de aprobación final

- Confirmar `shadcn/ui` + Tailwind como sistema UI definitivo.
- Confirmar `axios` frente a `fetch` nativo.
- Confirmar uso de `zustand` o limitar estado global a React Context.

## Criterios de cierre

Este documento se considera suficiente cuando define:

- librerías principales
- propósito de cada librería
- límites de uso
- pendientes de aprobación final
