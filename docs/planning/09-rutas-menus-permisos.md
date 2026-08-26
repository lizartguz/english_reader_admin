# Rutas, menús y permisos - English Reader Admin

## Objetivo

Este documento define rutas administrativas, menú lateral, rutas protegidas y visibilidad según roles/permisos.

## Roles

Roles relevantes para React Admin:

```text
SUPER_ADMIN
ADMIN
```

`CLIENT` no debe acceder al panel administrativo.

## Rutas base

```text
/login
/forgot-password
/reset-password
/admin
```

## Rutas administrativas propuestas

| Ruta | Módulo | Acceso inicial |
| --- | --- | --- |
| `/admin/dashboard` | Dashboard | SUPER_ADMIN, ADMIN |
| `/admin/stories` | Historias | SUPER_ADMIN, ADMIN |
| `/admin/reading-levels` | Niveles de lectura | SUPER_ADMIN, ADMIN |
| `/admin/dictionary` | Palabras | SUPER_ADMIN, ADMIN |
| `/admin/translations` | Traducciones | SUPER_ADMIN, ADMIN |
| `/admin/users/clients` | Usuarios cliente | SUPER_ADMIN, ADMIN según permiso |
| `/admin/users/admins` | Usuarios administradores | SUPER_ADMIN |
| `/admin/roles` | Roles | SUPER_ADMIN |
| `/admin/permissions` | Permisos | SUPER_ADMIN |
| `/admin/audit` | Auditoría | SUPER_ADMIN o permiso específico |
| `/admin/system-logs` | Logs del sistema | SUPER_ADMIN |
| `/admin/settings` | Configuración | SUPER_ADMIN |

## Sidebar

Menú propuesto:

```text
Dashboard
Contenido
  Historias
  Niveles de lectura
Diccionario
  Palabras
  Traducciones
Usuarios
  Clientes
  Administradores
Seguridad
  Roles
  Permisos
Sistema
  Auditoría
  Logs del sistema
  Configuración
```

## Reglas de visibilidad

- El menú se construye desde configuración central.
- Cada ítem declara permisos o roles requeridos.
- `system-logs` solo aparece para `SUPER_ADMIN`.
- Las acciones dentro de tablas también declaran permisos.
- Ocultar un menú no reemplaza la validación del backend.

## Rutas protegidas

Toda ruta bajo `/admin` debe requerir sesión administrativa.

Flujo:

```text
usuario abre ruta admin
  -> verificar sesión local
  -> cargar usuario/permisos si hace falta
  -> validar acceso visual
  -> renderizar o redirigir
```

Si no hay sesión:

```text
redirigir a /login
```

Si hay sesión pero no permiso:

```text
mostrar pantalla de acceso denegado
```

## Permisos por acción

Acciones típicas:

```text
create
read
update
delete
publish
archive
review
assign
```

Ejemplos:

```text
stories.create
stories.update
stories.delete
translations.review
users.admins.read
system_logs.read
```

## Recuperación de contraseña

Rutas públicas:

```text
/forgot-password
/reset-password
```

Estas rutas no deben revelar si un correo existe.

Los mensajes deben ser amigables y coherentes con la API.

## Criterios de cierre

Este documento se considera suficiente cuando define:

- rutas públicas
- rutas administrativas
- sidebar
- acceso por rol
- rutas protegidas
- permisos por acción
- recuperación de contraseña
