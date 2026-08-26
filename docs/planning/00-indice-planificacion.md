# Índice de planificación - English Reader Admin

Este directorio contiene la planificación técnica del proyecto `english_reader_admin`.

El objetivo es definir la arquitectura visual y funcional del panel administrativo React antes de implementar pantallas, rutas, componentes o consumo de API.

## Ecosistema del proyecto

English Reader está compuesto por tres proyectos relacionados:

```text
english_reader_api    -> Backend NestJS, API, seguridad, reglas de negocio, persistencia e integraciones.
english_reader_admin  -> Panel administrativo React para gestión visual de contenido, usuarios, roles y configuración.
english_reader_app    -> Aplicación Flutter para Android, iOS y Web orientada al usuario cliente.
```

Aunque cada proyecto tiene responsabilidades separadas, los tres comparten contratos, reglas y flujos. Un cambio en endpoints, permisos, validaciones o modelos de datos de la API puede requerir ajustes en React Admin.

## Ubicación local de proyectos

En el entorno local actual, los proyectos se encuentran en:

```text
C:\xampp\htdocs\english_reader_api    -> Backend NestJS y API.
C:\xampp\htdocs\english_reader_admin  -> Panel administrativo React.
C:\xampp\htdocs\english_reader_app    -> Aplicación Flutter.
```

## Documentos

1. `01-arquitectura-admin.md`
   - Define arquitectura general del panel React, responsabilidades, módulos, seguridad visual, navegación y relación con la API.

2. `02-patron-crud-ui.md`
   - Define patrón estándar para pantallas CRUD, tablas, filtros, modales, validaciones, acciones, confirmaciones, paginación y mensajes.

3. `03-diseno-interfaz-admin.md`
   - Define criterios visuales del dashboard, sidebar, menús, responsividad, mensajes y consistencia de interfaz.

4. `04-integracion-api-admin.md`
   - Define cómo React Admin consume la API, maneja autenticación, permisos, validaciones, errores, archivos protegidos y contratos.

5. `05-operacion-despliegue-admin.md`
   - Define criterios de build, variables de entorno, despliegue estático y relación operativa con la API.

6. `06-pruebas-calidad-admin.md`
   - Define pruebas E2E con Playwright para flujos administrativos, CRUD, permisos, modales y responsive.

7. `07-librerias-dependencias-admin.md`
   - Define librerías recomendadas para rutas, estado del servidor, formularios, validación, tablas, UI, iconos, mensajes y cliente HTTP.

8. `08-estructura-carpetas-componentes.md`
   - Define estructura de carpetas, componentes reutilizables, separación por features y reglas para evitar código espagueti.

9. `09-rutas-menus-permisos.md`
   - Define rutas administrativas, menú lateral, permisos visuales, rutas protegidas y acceso por rol.

10. `10-modulos-crud-admin.md`
   - Define módulos CRUD administrativos, columnas sugeridas, filtros, acciones y reglas particulares por módulo.

11. `11-formularios-validaciones-admin.md`
   - Define patrón de formularios, modales, validaciones en español, manejo de archivos, errores y confirmaciones.

12. `12-estandares-codigo-admin.md`
   - Define estándares de código React/TypeScript, imports, constantes, comentarios, componentes, hooks y servicios.

13. `13-sesion-estados-feedback-admin.md`
   - Define manejo de sesión expirada, carga global, mensajes reutilizables, acceso denegado, API caída y limpieza de datos locales.

## Regla de separación

El panel React administra la experiencia visual y de interacción.

No debe duplicar reglas críticas de seguridad ni confiar en validaciones solo del frontend. Toda acción debe ser validada nuevamente por `english_reader_api`.
