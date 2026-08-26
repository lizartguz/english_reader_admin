# Diseño de interfaz Admin - English Reader

## Objetivo

Este documento define criterios visuales y de experiencia para `english_reader_admin`.

La interfaz debe ser consistente, administrativa, responsiva y orientada a operación diaria.

## Estilo general

El panel debe usar una plantilla administrativa similar al enfoque de AdminLTE:

```text
header superior
sidebar lateral
área principal de contenido
footer opcional
```

Debe priorizar claridad, densidad razonable de información y facilidad para trabajar con tablas, filtros y formularios.

## Sidebar y navegación

El sidebar debe contener menús organizados por módulo:

```text
Dashboard
Historias
Niveles de lectura
Palabras
Traducciones
Usuarios
Roles y permisos
Auditoría
Logs del sistema
Configuración
```

Cada menú debe mostrarse según permisos del usuario autenticado.

La opción `Logs del sistema` debe estar visible solo para `SUPER_ADMIN`.

## Dashboard

El dashboard debe mostrar información operativa útil.

Ejemplos:

- historias publicadas
- historias en borrador
- palabras consultadas
- traducciones pendientes de revisión
- usuarios cliente activos
- últimos eventos administrativos

No debe mostrar información técnica sensible. Los errores técnicos pertenecen a la sección de logs del sistema para `SUPER_ADMIN`.

## Componentes visuales

Se deben definir componentes reutilizables para:

- layout administrativo
- sidebar
- header
- breadcrumbs
- tablas
- filtros
- modales
- confirmaciones
- mensajes de éxito/error
- badges de estado
- dropdown de acciones
- paginación
- campos de archivo

El sistema visual recomendado es `shadcn/ui` con Tailwind CSS, adaptado a una interfaz administrativa compacta.

No se debe construir una landing page ni una interfaz decorativa. La primera pantalla autenticada debe ser el dashboard operativo.

## Estados visuales

Toda pantalla debe contemplar:

- cargando
- vacío
- error amigable
- sin permisos
- sesión expirada
- datos cargados correctamente

El estado de carga debe usar un componente visual reutilizable, preferentemente circular, para mantener consistencia en tablas, formularios, modales y acciones lentas.

Ejemplos de uso:

- carga inicial de tabla
- guardando formulario
- actualizando registro
- eliminando o archivando
- consultando permisos
- cargando archivos protegidos

Este componente debe documentarse y centralizarse como parte de los componentes compartidos.

## Mensajes al usuario

Los mensajes deben estar en español, ser claros y no técnicos.

Ejemplos:

```text
Cambios guardados correctamente.
No se pudo completar la operación. Inténtalo nuevamente.
No tienes permisos para realizar esta acción.
El archivo seleccionado no tiene un formato permitido.
```

No se deben mostrar errores SQL, stack traces, nombres internos de clases ni mensajes crudos del backend.

Los mensajes de éxito, error, advertencia e información deben mostrarse mediante componentes centralizados y reutilizables.

El componente debe aceptar al menos:

```text
título
descripción
tipo
acción opcional
```

## Responsividad

El diseño debe funcionar en escritorio, tablet y móvil.

Criterios:

- sidebar colapsable en escritorio
- sidebar tipo drawer o menú ocultable en móvil
- tablas con scroll horizontal controlado cuando sea necesario
- filtros reorganizados en pantallas pequeñas
- modales con scroll interno y altura máxima
- botones con tamaño cómodo para interacción táctil

Las tablas deben priorizar legibilidad. En móvil se permite scroll horizontal controlado o vistas compactas, pero no se deben ocultar datos críticos sin una alternativa visible.

## Accesibilidad

Criterios mínimos:

- contraste suficiente
- labels asociados a campos
- navegación por teclado
- foco visible
- modales con cierre claro
- errores no comunicados solo por color
- botones iconográficos con tooltip o texto accesible
- indicadores de carga con texto accesible cuando la espera sea perceptible

## Colores de acciones

Los colores deben ser consistentes:

- crear: verde
- editar: color primario o neutro
- eliminar: rojo
- cancelar: neutro
- acciones informativas: azul o gris según contexto

La confirmación de eliminación debe diferenciar claramente cancelar y confirmar.

## Criterios de cierre de este documento

Este documento se considera suficiente cuando define:

- estructura visual del admin
- sidebar y menús
- dashboard
- componentes reutilizables
- estados visuales
- mensajes amigables
- responsividad
- colores de acciones
