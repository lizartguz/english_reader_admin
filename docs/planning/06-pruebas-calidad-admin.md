# Pruebas y calidad Admin - English Reader

## Objetivo

Este documento define pruebas de calidad para `english_reader_admin`.

## Playwright

Se usará Playwright para pruebas E2E del panel administrativo.

Referencia: https://playwright.dev/

Las pruebas deben usar selectores estables, preferentemente `data-testid` en componentes críticos.

No depender de textos frágiles cuando el texto pueda cambiar por redacción.

## Flujos prioritarios

- login administrativo
- cierre de sesión
- sesión expirada
- navegación por sidebar
- menús visibles según permisos
- ocultar logs del sistema para ADMIN
- mostrar logs del sistema solo para SUPER_ADMIN
- listar historias
- filtrar historias
- paginar tablas
- crear registro desde modal
- editar registro desde modal
- validar campos obligatorios en español
- confirmar eliminación
- mostrar mensajes de éxito
- mostrar errores amigables
- cargar imágenes y audios con validación de formato/tamaño
- revisar comportamiento responsive

## Reglas de calidad UI

Las pruebas deben verificar:

- no recargar página completa en operaciones CRUD
- modales abren y cierran correctamente
- la tabla se actualiza después de guardar
- dropdown de acciones respeta permisos
- errores técnicos no se muestran al usuario
- archivos protegidos se cargan desde API

## Datos de prueba

Los escenarios deben contar con usuarios de prueba:

```text
SUPER_ADMIN
ADMIN
```

Y datos controlados:

```text
historias
niveles
palabras
traducciones
usuarios cliente
```

No se deben usar credenciales reales de producción.

## Responsive

Debe existir cobertura mínima para:

- escritorio
- tablet
- móvil

En móvil se debe validar:

- sidebar tipo drawer
- filtros reorganizados
- modales usables
- acciones disponibles
- tablas legibles o con scroll controlado

## Criterios de cierre

Este documento se considera suficiente cuando define:

- uso de Playwright
- flujos administrativos prioritarios
- validaciones de permisos
- pruebas de modales
- pruebas responsive
- errores amigables
