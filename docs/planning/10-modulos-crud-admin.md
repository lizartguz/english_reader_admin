# Módulos CRUD Admin - English Reader

## Objetivo

Este documento define los módulos CRUD administrativos, sus filtros, columnas y acciones iniciales.

Todos los CRUD deben seguir `02-patron-crud-ui.md`.

## Reglas comunes

Cada módulo CRUD debe tener:

- filtros superiores
- botón verde de crear cuando el usuario tenga permiso
- tabla paginada
- columna final de acciones
- dropdown de acciones
- modales para crear y editar
- confirmación para eliminar o archivar
- mensajes amigables
- validaciones frontend/backend
- diseño responsivo

## Historias

Ruta:

```text
/admin/stories
```

Filtros:

- búsqueda por título
- estado
- nivel de lectura
- fecha de publicación

Columnas:

- título
- nivel
- estado
- fecha de publicación
- actualizado
- acciones

Acciones:

- ver
- editar
- publicar
- colocar en borrador
- archivar
- eliminar si el permiso lo permite

## Niveles de lectura

Ruta:

```text
/admin/reading-levels
```

Filtros:

- búsqueda por nombre/código
- estado activo/inactivo

Columnas:

- código
- nombre
- orden
- estado
- actualizado
- acciones

Acciones:

- editar
- activar/desactivar
- eliminar si no está en uso

## Palabras

Ruta:

```text
/admin/dictionary
```

Filtros:

- palabra
- idioma
- tipo gramatical
- estado de revisión

Columnas:

- palabra
- fonética
- tipo gramatical
- estado de revisión
- fuente
- actualizado
- acciones

Acciones:

- ver detalle
- editar
- revisar
- eliminar o archivar según regla

## Traducciones

Ruta:

```text
/admin/translations
```

Filtros:

- palabra
- idioma destino
- estado de revisión
- fuente

Columnas:

- palabra
- traducción
- idioma destino
- estado
- revisado por
- actualizado
- acciones

Acciones:

- editar
- aprobar
- rechazar
- eliminar si aplica

## Usuarios cliente

Ruta:

```text
/admin/users/clients
```

Filtros:

- nombre
- email
- teléfono
- estado

Columnas:

- nombre
- apellidos
- email
- teléfono
- estado
- último acceso
- acciones

Acciones:

- ver
- editar
- activar/desactivar
- bloquear/desbloquear

## Usuarios administradores

Ruta:

```text
/admin/users/admins
```

Acceso:

```text
SUPER_ADMIN
```

Filtros:

- nombre
- email
- rol
- estado

Columnas:

- nombre
- apellidos
- email
- roles
- estado
- último acceso
- acciones

Acciones:

- crear administrador
- editar
- asignar roles
- activar/desactivar
- eliminar según regla

`ADMIN` no debe gestionar usuarios administradores.

## Roles

Ruta:

```text
/admin/roles
```

Acceso:

```text
SUPER_ADMIN
```

Filtros:

- código
- nombre
- sistema/personalizado

Columnas:

- código
- nombre
- descripción
- sistema
- acciones

Acciones:

- crear
- editar
- asignar permisos
- eliminar solo si no es rol del sistema

## Permisos

Ruta:

```text
/admin/permissions
```

Acceso:

```text
SUPER_ADMIN
```

Filtros:

- módulo
- acción
- código

Columnas:

- código
- módulo
- acción
- descripción
- acciones

Acciones:

- ver
- editar si se permite

Los permisos base normalmente deben manejarse con cuidado para no romper el sistema.

## Auditoría

Ruta:

```text
/admin/audit
```

Filtros:

- usuario actor
- acción
- entidad
- fecha

Columnas:

- fecha
- actor
- acción
- entidad
- resumen
- acciones

Acciones:

- ver detalle

No debe permitir edición ni eliminación desde el panel común.

## Logs del sistema

Ruta:

```text
/admin/system-logs
```

Acceso:

```text
SUPER_ADMIN
```

Filtros:

- nivel
- fuente
- código de error
- ruta
- fecha

Columnas:

- fecha
- nivel
- fuente
- mensaje
- ruta
- actor
- acciones

Acciones:

- ver detalle

No debe permitir edición. La limpieza se hará por política de retención.

## Configuración

Ruta:

```text
/admin/settings
```

Acceso:

```text
SUPER_ADMIN
```

Configuraciones posibles:

- parámetros generales
- correo
- límites de archivos visibles
- proveedores externos visibles

Las credenciales sensibles no deben mostrarse completas.

## Criterios de cierre

Este documento se considera suficiente cuando define:

- módulos CRUD iniciales
- filtros
- columnas
- acciones
- reglas por rol
- restricciones especiales
