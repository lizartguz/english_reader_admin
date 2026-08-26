# Integración API Admin - English Reader

## Objetivo

Este documento define cómo `english_reader_admin` debe integrarse con `english_reader_api`.

React Admin es cliente de la API. No debe acceder directamente a base de datos, archivos del servidor ni proveedores externos.

## API base

La URL base debe configurarse por ambiente.

Variable esperada:

```text
VITE_API_BASE_URL
```

Ejemplo conceptual:

```text
http://localhost:3000/api/v1
```

## Cliente HTTP centralizado

Toda comunicación con la API debe pasar por un cliente HTTP centralizado.

Responsabilidades:

- configurar `VITE_API_BASE_URL`
- agregar credenciales o headers requeridos
- manejar errores comunes
- renovar sesión cuando corresponda
- mapear respuestas estándar de la API
- evitar llamadas HTTP dispersas en componentes

No se deben hacer llamadas directas desde componentes de página.

Cada feature debe consumir servicios propios que usen el cliente central.

## Autenticación

React Admin debe autenticarse contra la API.

Flujo:

```text
usuario ingresa credenciales
  -> React Admin llama a /auth/login
  -> API valida credenciales y permisos
  -> API devuelve sesión
  -> React Admin carga permisos y menús permitidos
```

El manejo de refresh token debe seguir la estrategia definida por la API.

Si la sesión expira, React Admin debe:

- intentar renovar sesión si la estrategia lo permite
- limpiar sesión local si no puede renovar
- redirigir a `/login`
- mostrar mensaje amigable

La sesión administrativa tendrá una duración máxima planificada de ocho horas desde el inicio de sesión.

Mientras la sesión esté activa, el cliente puede usar el flujo de refresh token definido por la API. Una vez superado el tiempo máximo de sesión, el usuario debe cerrar sesión y volver a autenticarse.

Cuando la sesión expire, React Admin debe mostrar un modal reutilizable con:

- título de sesión expirada
- descripción amigable
- cuenta regresiva de 4 segundos
- botón para ir inmediatamente a iniciar sesión

Al finalizar la cuenta regresiva, debe redirigir automáticamente a `/login`.

La limpieza local debe eliminar datos de sesión del frontend:

- tokens accesibles para el cliente según estrategia aprobada
- usuario autenticado
- permisos cargados
- caché sensible de queries
- estado global de sesión

La limpieza local no implica eliminación física de archivos subidos. Los archivos se gestionan desde la API y la base de datos, usando eliminación lógica cuando corresponda.

## Permisos visuales

React Admin puede ocultar:

- menús
- botones
- acciones del dropdown
- formularios o campos restringidos

Pero la autorización real siempre corresponde a `english_reader_api`.

La sección de logs del sistema debe estar disponible solo para `SUPER_ADMIN`.

## CRUD administrativo

Todos los CRUD deben consumir endpoints paginados y filtrables.

Patrón:

```text
listar
crear
editar
cambiar estado
eliminar o archivar
```

Crear y editar siempre deben abrirse en ventanas modales.

Eliminar siempre debe pedir confirmación antes de invocar la API.

Las consultas y mutaciones deben manejarse con TanStack Query.

Reglas:

- query keys centralizadas
- invalidar listados después de crear, editar, eliminar o cambiar estado
- no duplicar datos del servidor en estado global
- manejar estados cargando, error, vacío y éxito

## Contratos y modelos

Los modelos TypeScript deben mantenerse alineados con `english_reader_api`.

Cuando exista OpenAPI/Swagger, se debe evaluar generar tipos o validar manualmente que los modelos del frontend coincidan con los contratos.

Cambios en respuestas API deben revisarse en:

- types
- schemas
- servicios API
- tablas
- formularios
- mensajes

## Validaciones

Cada formulario debe validar en frontend y backend.

React Admin valida para mejorar experiencia.

La API valida para proteger la persistencia y la seguridad.

Los mensajes de validación deben estar en español.

## Manejo de errores

React Admin debe mostrar mensajes amigables.

Si la API responde con error técnico controlado, el panel debe mostrar un texto genérico y no técnico.

Ejemplo:

```text
No se pudo completar la operación. Inténtalo nuevamente.
```

El detalle técnico debe quedar en `system_logs` del backend.

Si la API no está disponible, el panel debe mostrar un mensaje amigable, por ejemplo:

```text
No se pudo conectar con el servidor. Inténtalo nuevamente en unos minutos.
```

Si el usuario intenta acceder a una sección por URL sin permiso, debe mostrarse una pantalla o mensaje de acceso denegado:

```text
No tienes permiso para acceder a esta sección.
```

No se debe indicar información técnica sobre roles internos, guards, endpoints o implementación.

## Archivos protegidos

Las imágenes y audios administrativos deben obtenerse mediante endpoints protegidos.

Reglas:

- no usar rutas públicas directas
- no mostrar rutas internas del servidor
- validar permisos antes de previsualizar o descargar
- respetar límites y formatos definidos en la API

## Sin recarga de página

Las operaciones deben ser asíncronas.

No debe recargarse toda la página para:

- filtrar
- paginar
- crear
- editar
- eliminar
- cambiar estado

## Criterios de cierre de este documento

Este documento se considera suficiente cuando define:

- URL base configurable
- autenticación
- permisos visuales
- consumo CRUD
- validaciones compartidas
- errores amigables
- archivos protegidos
- operaciones sin recarga
