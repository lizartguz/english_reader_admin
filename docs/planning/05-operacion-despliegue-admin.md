# Operación y despliegue Admin - English Reader

## Objetivo

Este documento define criterios de operación y despliegue para `english_reader_admin`.

## Build

El proyecto React debe compilarse como aplicación web estática.

Comando conceptual:

```bash
npm run build
```

El resultado debe publicarse en el servidor o servicio elegido para frontend.

## Docker Engine

La estrategia objetivo es desplegar el admin usando contenedor en Docker Engine cuando corresponda.

Recomendación:

- compilar React en una etapa de build
- servir archivos estáticos desde un contenedor web ligero
- inyectar configuración por ambiente
- no incluir secretos dentro del build
- apuntar a `english_reader_api` mediante URL configurada
- proteger rutas administrativas desde React y reforzar permisos desde la API

El servidor final y archivos concretos de despliegue se definirán cuando toque implementación/operación.

## Variables de entorno

Variables esperadas:

```text
VITE_API_BASE_URL
VITE_APP_ENV
```

Las variables deben definirse por ambiente.

## Ambientes

Ambientes esperados:

```text
development
staging
production
```

Cada ambiente debe apuntar a la API correspondiente.

## Relación con la API

React Admin depende de `english_reader_api`.

Si cambia un contrato de API, deben revisarse:

- modelos TypeScript
- formularios
- validaciones
- filtros
- columnas de tablas
- mensajes de error
- permisos visuales

## Recursos protegidos

El admin no debe publicar imágenes ni audios mediante rutas públicas directas.

La previsualización debe hacerse mediante endpoints protegidos de la API.

## Logs y errores

Los errores técnicos deben registrarse en la API.

React Admin solo debe mostrar mensajes amigables.

La consulta de logs del sistema debe estar disponible solo para `SUPER_ADMIN`.

## Criterios de cierre de este documento

Este documento se considera suficiente cuando define:

- build
- Docker Engine como opción de despliegue
- variables por ambiente
- relación con API
- recursos protegidos
- logs y errores
