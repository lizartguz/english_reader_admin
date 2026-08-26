# Patrón CRUD UI - English Reader Admin

## Objetivo

Este documento define el patrón estándar para pantallas CRUD del panel administrativo React.

El objetivo es que módulos como historias, niveles, usuarios, roles, permisos, palabras y traducciones tengan una experiencia consistente.

## Estructura general de una vista CRUD

Cada sección CRUD debe usar una estructura similar:

```text
Título de sección
Fila superior de filtros y acciones
Tabla informativa
Paginación
Modales de creación, edición, confirmación y resultado
```

## Fila superior

La parte superior debe contener filtros necesarios y acciones principales.

Ejemplo conceptual:

```text
[Buscar] [Estado] [Nivel] [Limpiar filtros]                         [Crear]
```

El botón de creación debe estar en la misma fila de filtros cuando el espacio lo permita.

El botón de creación debe usar un color estándar verde para mantener consistencia visual.

## Filtros

Los filtros deben ser útiles y específicos por módulo.

Ejemplo para historias:

```text
búsqueda por título
estado
nivel de lectura
rango de publicación
```

Los filtros deben actualizar la tabla sin recargar la página.

En dispositivos móviles, los filtros pueden reorganizarse en columnas o panel plegable si el espacio no alcanza.

## Tabla

Cada CRUD debe mostrar una tabla con columnas relevantes.

La última columna debe ser de acciones.

Ejemplo conceptual para historias:

```text
Título | Nivel | Estado | Publicado | Actualizado | Acciones
```

La tabla debe soportar:

- carga inicial
- estado cargando
- estado vacío
- error amigable
- paginación
- ordenamiento cuando corresponda
- diseño responsivo

## Dropdown de acciones

La última columna debe contener un dropdown de acciones.

Acciones comunes:

```text
Ver
Editar
Publicar
Colocar en borrador
Archivar
Eliminar
```

Las acciones visibles deben depender de permisos y estado del registro.

La API debe validar nuevamente cada acción.

Las acciones relacionadas con logs del sistema solo deben mostrarse a usuarios `SUPER_ADMIN`.

## Formularios en modales

La creación y edición de registros debe realizarse siempre mediante ventanas modales.

Esta regla aplica a todos los CRUD administrativos, incluyendo historias, niveles, usuarios, roles, permisos, palabras, traducciones y cualquier módulo futuro que administre registros.

Reglas:

- no se deben crear pantallas separadas para crear registros salvo que una excepción sea aprobada en planificación
- no se deben crear pantallas separadas para editar registros salvo que una excepción sea aprobada en planificación
- el modal debe contener el formulario completo necesario para la acción
- el modal de creación debe abrirse desde el botón principal de creación del módulo
- el modal de edición debe abrirse desde el dropdown de acciones de la fila correspondiente
- los campos obligatorios deben estar identificados
- la validación debe mostrarse en español
- los mensajes deben indicar qué debe corregir el usuario
- el modal no debe cerrarse automáticamente si hay error de validación
- al guardar correctamente, debe mostrarse mensaje de éxito y actualizar la tabla

Ejemplo de mensaje:

```text
Historia guardada correctamente.
```

## Validaciones

Las validaciones deben existir en frontend y backend.

```text
React Admin -> ayuda inmediata al usuario.
NestJS API  -> seguridad, consistencia y persistencia.
```

Ejemplo:

```text
El título de una historia es obligatorio.
React lo valida antes de enviar.
NestJS lo valida antes de guardar.
```

No se deben mostrar mensajes técnicos al usuario.

## Campos de archivo

Los formularios que permitan cargar imágenes o audios deben validar el archivo antes de enviarlo a la API.

Imágenes permitidas:

```text
png
jpg
jpeg
webp
```

Tamaño máximo de imagen:

```text
10 MB
```

Audios permitidos:

```text
mp3
m4a
```

Tamaño máximo de audio:

```text
15 MB
```

Reglas:

- mostrar mensajes de validación en español
- evitar enviar archivos con formato no permitido
- optimizar imágenes antes de guardar cuando la implementación lo permita
- no mostrar rutas internas de archivos
- cargar vistas previas mediante endpoints protegidos de la API
- no depender de URLs públicas directas para imágenes o audios administrativos

Los audios no requieren compresión automática inicial.

## Confirmación de eliminación

Toda acción de eliminación debe mostrar una ventana de confirmación.

La confirmación debe explicar claramente la acción.

Ejemplo:

```text
¿Deseas eliminar esta historia?
Esta acción puede afectar la información visible en la aplicación.
```

El botón de confirmación debe ser visualmente distinto de cancelar.

La API debe validar permisos y reglas aunque el frontend haya mostrado confirmación.

## Mensajes de éxito y error

Después de guardar, actualizar, eliminar o cambiar estado, el usuario debe recibir un mensaje claro.

Ejemplos:

```text
Cambios guardados correctamente.
Registro eliminado correctamente.
No se pudo completar la operación. Inténtalo nuevamente.
No tienes permisos para realizar esta acción.
```

Los errores técnicos deben registrarse en backend. La interfaz no debe mostrar errores SQL, stack traces, nombres internos de clases ni fallos crudos del servidor.

Cuando la API indique que un fallo fue registrado, el panel debe seguir mostrando un mensaje amigable. El detalle técnico solo debe estar disponible en la sección de logs del sistema para `SUPER_ADMIN`.

## Paginación

Todas las tablas administrativas deben usar paginación cuando el volumen pueda crecer.

La paginación debe consumir metadatos de la API:

```text
page
limit
total
total_pages
```

Debe poder cambiar página y cantidad por página si el módulo lo requiere.

## Responsividad

Las pantallas CRUD deben adaptarse a escritorio, tablet y móvil.

Criterios:

- filtros en una fila cuando haya espacio
- filtros en varias filas o panel plegable en móvil
- tablas con scroll horizontal controlado si es necesario
- acciones accesibles desde móvil
- modales con altura máxima y scroll interno cuando el contenido sea largo
- botones con tamaño cómodo para toque

## Sin recarga de página

Las operaciones deben ejecutarse de forma asíncrona.

El panel no debe recargar toda la página para:

- filtrar
- paginar
- crear
- editar
- eliminar
- cambiar estado

Después de cada operación, la tabla debe refrescar sus datos desde la API o actualizar el estado local de forma controlada.

## Impacto en API

Para soportar este patrón, `english_reader_api` debe exponer:

- endpoints paginados
- filtros por módulo
- mensajes seguros
- validaciones consistentes
- códigos HTTP correctos
- permisos por acción
- cambios de estado claros

## Criterios de cierre de este documento

Este documento se considera suficiente cuando define:

- estructura estándar de CRUD
- filtros superiores
- botón verde de creación
- tabla con acciones
- dropdown de acciones
- modales para formularios
- validaciones en español
- confirmación de eliminación
- mensajes amigables
- paginación
- responsividad
- navegación sin recarga
