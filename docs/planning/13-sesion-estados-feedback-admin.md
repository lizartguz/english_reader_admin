# Sesión, estados y feedback Admin - English Reader

## Objetivo

Este documento define el manejo centralizado de sesión, estados de carga, mensajes, acceso denegado y fallos de API en `english_reader_admin`.

## Sesión administrativa

La sesión administrativa tendrá una duración máxima planificada de ocho horas desde el inicio de sesión.

Mientras la sesión esté vigente, el cliente puede usar el flujo de refresh token definido por `english_reader_api`.

Cuando la sesión máxima expire, el usuario debe volver a iniciar sesión.

## Modal de sesión expirada

Al detectar expiración definitiva de sesión, el panel debe mostrar un modal reutilizable.

Contenido:

```text
Título: Sesión expirada
Descripción: Tu sesión finalizó. Serás redirigido al inicio de sesión.
Cuenta regresiva: 4 segundos
Acción: Ir a iniciar sesión
```

Reglas:

- si el usuario presiona el botón, se redirige inmediatamente a `/login`
- si no presiona el botón, se redirige al terminar la cuenta regresiva
- antes de redirigir se limpian datos locales de sesión
- el modal debe ser reutilizable

## Limpieza de datos locales

La limpieza local se refiere a datos del frontend:

- tokens accesibles según la estrategia definida
- usuario autenticado
- permisos cargados
- caché sensible de TanStack Query
- estado global de sesión
- preferencias temporales de navegación si corresponde

No se refiere a eliminar físicamente archivos subidos.

Los archivos cargados se gestionan desde la API y base de datos. Cuando corresponda, se usará eliminación lógica para conservar trazabilidad y auditoría.

## Estados de carga

Se debe crear un componente reutilizable de carga circular.

Usos:

- cargando tabla
- cargando detalle
- guardando formulario
- editando registro
- eliminando o archivando
- cargando permisos
- validando sesión
- cargando archivos protegidos

Debe evitarse crear loaders distintos en cada vista.

## Feedback centralizado

Los mensajes de usuario deben centralizarse en un componente reutilizable.

Parámetros mínimos:

```text
tipo
título
descripción
acción opcional
```

Tipos:

```text
success
error
warning
info
```

Ejemplos:

```text
Cambios guardados correctamente.
No se pudo completar la operación. Inténtalo nuevamente.
No tienes permiso para acceder a esta sección.
No se pudo conectar con el servidor.
```

## API no disponible

Si la API está caída o no responde, se debe mostrar un mensaje amigable:

```text
No se pudo conectar con el servidor. Inténtalo nuevamente en unos minutos.
```

No se deben mostrar detalles técnicos, códigos internos, stack traces ni mensajes crudos de red.

## Acceso denegado

Si un usuario intenta acceder por URL a una sección sin permiso, debe mostrarse una vista o mensaje reutilizable:

```text
No tienes permiso para acceder a esta sección.
```

No se deben revelar detalles técnicos como nombre del guard, endpoint interno, estructura de permisos o reglas internas.

## Relación con logs del sistema

Los errores técnicos deben registrarse en `system_logs` desde la API cuando corresponda.

React Admin solo muestra mensajes amigables.

La sección de logs del sistema solo puede verla `SUPER_ADMIN`.

## Criterios de cierre

Este documento se considera suficiente cuando define:

- duración de sesión administrativa
- modal de sesión expirada
- limpieza de datos locales
- loader circular reutilizable
- feedback centralizado
- API no disponible
- acceso denegado
- relación con `system_logs`
