# Formularios y validaciones Admin - English Reader

## Objetivo

Este documento define el patrón de formularios, modales y validaciones de `english_reader_admin`.

## Regla principal

Crear y editar registros debe realizarse siempre mediante ventanas modales.

Excepciones solo pueden aprobarse en planificación.

## Tecnología recomendada

```text
react-hook-form
zod
@hookform/resolvers
```

## Estructura de modal

Cada modal de formulario debe tener:

- título claro
- descripción breve si hace falta
- campos agrupados
- validaciones visibles
- botón cancelar
- botón guardar
- estado guardando
- manejo de error amigable

El estado `guardando` debe usar un indicador reutilizable, como spinner circular en el botón o bloqueo visual del modal cuando corresponda.

## Validaciones

Las validaciones deben estar en español.

Ejemplos:

```text
El título es obligatorio.
El correo no tiene un formato válido.
El archivo supera el tamaño máximo permitido.
Selecciona un nivel de lectura.
```

La API debe repetir las mismas validaciones obligatorias.

## Schemas

Cada feature debe tener sus schemas:

```text
features/stories/schemas/story.schema.ts
features/users/schemas/user.schema.ts
features/roles/schemas/role.schema.ts
```

Los schemas no deben vivir dentro del componente si son reutilizables.

## Errores del backend

Cuando la API devuelva errores de validación, el frontend debe mapearlos al campo correspondiente cuando sea posible.

Si el error no corresponde a un campo, debe mostrarse como mensaje general del modal.

Nunca mostrar:

- SQL
- stack trace
- error crudo del servidor
- nombres internos de clases

## Archivos

Validaciones de imagen:

```text
formatos: png, jpg, jpeg, webp
máximo: 10 MB
```

Validaciones de audio:

```text
formatos: mp3, m4a
máximo: 15 MB
```

Las imágenes deben optimizarse cuando la implementación lo permita.

Los archivos deben enviarse a la API mediante flujo protegido.

## Confirmaciones

Las acciones destructivas o sensibles deben usar confirmación modal.

Ejemplos:

- eliminar
- archivar
- bloquear usuario
- cambiar rol
- rechazar traducción

Los botones deben distinguir claramente cancelar y confirmar.

## Mensajes de resultado

Después de operaciones exitosas:

```text
Cambios guardados correctamente.
Registro creado correctamente.
Registro actualizado correctamente.
Registro eliminado correctamente.
```

Después de fallos:

```text
No se pudo completar la operación. Inténtalo nuevamente.
```

Los mensajes deben mostrarse mediante un componente centralizado que reciba:

```text
título
descripción
tipo
acción opcional
```

Esto evita duplicar mensajes y estilos en cada módulo.

## Accesibilidad

Los formularios deben:

- asociar label con input
- permitir navegación con teclado
- enfocar el primer campo inválido cuando sea posible
- no depender solo del color para errores
- cerrar modales con controles claros

## Criterios de cierre

Este documento se considera suficiente cuando define:

- formularios en modales
- librerías de formularios
- validaciones en español
- schemas por feature
- errores del backend
- archivos
- confirmaciones
- mensajes
- accesibilidad
