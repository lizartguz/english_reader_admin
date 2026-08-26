# Arquitectura Admin - English Reader

## Objetivo

`english_reader_admin` es el panel administrativo web de English Reader.

Su responsabilidad es permitir que usuarios autorizados gestionen contenido, usuarios, roles, permisos, traducciones, palabras, niveles y configuraciones mediante una interfaz visual en React.

## Ecosistema relacionado

```text
english_reader_api    -> NestJS: expone datos, seguridad, permisos y reglas de negocio.
english_reader_admin  -> React: consume la API para gestión administrativa.
english_reader_app    -> Flutter: consume datos publicados para usuarios cliente.
```

React Admin no debe conectarse directamente a la base de datos ni decidir permisos reales. Toda operación debe pasar por `english_reader_api`.

## Enfoque técnico

El proyecto usará:

```text
React
TypeScript
Vite
ESLint
```

Las librerías complementarias aprobadas o propuestas se documentan en `07-librerias-dependencias-admin.md`.

La estructura debe ser modular por funcionalidades, evitando pantallas grandes sin separación.

## Estructura propuesta

```text
src/
  app/
    router/
    providers/
    layouts/

  core/
    api/
    auth/
    config/
    errors/
    permissions/
    ui/
    utils/

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
```

La estructura final detallada de carpetas, componentes reutilizables, hooks, servicios y features se documenta en `08-estructura-carpetas-componentes.md`.

## Plantilla administrativa

La interfaz debe usar una estructura tipo panel administrativo, similar al enfoque de AdminLTE:

```text
Header superior
Sidebar lateral
Área principal de contenido
Footer opcional
```

El sidebar debe contener menús y submenús según módulos disponibles.

Cada opción de menú debe respetar permisos y roles. React puede ocultar elementos no permitidos, pero la API siempre debe validar la autorización real.

La opción o menú de logs del sistema debe estar visible únicamente para usuarios con rol `SUPER_ADMIN`.

`ADMIN` no debe ver ni acceder visualmente a esta sección.

Las rutas, menús y permisos visuales se detallan en `09-rutas-menus-permisos.md`.

## Responsividad

El panel debe ser responsivo.

Criterios:

- sidebar colapsable en escritorio
- sidebar ocultable o tipo drawer en móvil
- tablas adaptables en pantallas pequeñas
- filtros reorganizados por ancho disponible
- formularios usables desde dispositivos móviles
- botones y menús con áreas táctiles cómodas

## Navegación

La navegación debe evitar recargas completas de página.

React debe manejar rutas internas y consumir la API de forma asíncrona.

Cuando una operación cree, edite, elimine o cambie estado, se debe actualizar la vista sin recargar toda la aplicación.

## Seguridad visual

El frontend debe:

- ocultar menús no permitidos
- ocultar acciones no permitidas
- redirigir usuarios no autenticados al login
- manejar expiración de sesión
- mostrar mensajes amigables
- mostrar el menú de logs del sistema solo para `SUPER_ADMIN`

El frontend no debe:

- asumir que ocultar un botón protege una acción
- almacenar permisos como fuente definitiva
- mostrar errores técnicos al usuario

## Relación con API

Toda información debe venir de `english_reader_api`.

El panel debe consumir:

- autenticación
- permisos del usuario autenticado
- listados paginados
- filtros
- creación y edición
- cambios de estado
- eliminación lógica o eliminación permitida
- auditoría
- logs del sistema solo para `SUPER_ADMIN`

## Criterios de cierre de este documento

Este documento se considera suficiente cuando define:

- responsabilidad del panel React
- relación con API y Flutter
- estructura modular
- plantilla administrativa
- navegación sin recarga
- seguridad visual basada en permisos
- responsividad general
