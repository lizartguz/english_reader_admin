# English Reader Admin

Panel administrativo web de English Reader. Consume `english_reader_api` para
gestionar contenido, diccionario, usuarios, roles y trazabilidad.

```text
english_reader_api    -> backend NestJS: datos, seguridad y reglas de negocio
english_reader_admin  -> este proyecto: panel administrativo en React
english_reader_app    -> aplicación de lectura en Flutter
```

La planificación técnica vive en [`docs/planning/`](docs/planning/00-indice-planificacion.md).

## Requisitos

- Node.js 20.19+
- `english_reader_api` corriendo y con la base sembrada

## Puesta en marcha

```bash
npm install
cp .env.example .env.development
npm run dev
```

El panel queda en `http://localhost:5173`. Las credenciales de desarrollo son
las del seeder de la API (`src/database/seeds/users.seeder.ts`).

## Scripts

| Script                    | Descripción                                        |
| ------------------------- | -------------------------------------------------- |
| `npm run dev`             | Servidor de desarrollo con recarga en caliente.    |
| `npm run build`           | Verifica tipos y compila a `dist/`.                |
| `npm run preview`         | Sirve localmente el resultado de `build`.          |
| `npm run lint`            | ESLint sobre el código y las pruebas.              |
| `npm run test:e2e`        | Pruebas end to end con Playwright.                 |
| `npm run test:e2e:ui`     | Las mismas pruebas en modo interactivo.            |
| `npm run test:e2e:report` | Abre el último reporte HTML.                       |

## Estructura

```text
src/
  app/        rutas, providers y layouts
  core/       cliente HTTP, sesión, permisos, UI compartida y utilidades
  features/   un módulo por sección del panel (api, hooks, components, pages)
  components/ primitivos de shadcn/ui
e2e/          pruebas end to end
docker/       configuración de nginx y de inyección de ambiente
```

Cada feature agrupa lo suyo: servicios de API, hooks de consulta y mutación,
componentes, esquemas de validación y tipos. Lo compartido vive en `core/`.

## Configuración por ambiente

| Variable            | Uso                                                |
| ------------------- | -------------------------------------------------- |
| `VITE_API_BASE_URL` | URL base de la API. Solo desarrollo.               |
| `VITE_APP_ENV`      | Ambiente declarado. Solo desarrollo.               |
| `API_BASE_URL`      | URL base de la API en el contenedor.               |
| `APP_ENV`           | Ambiente declarado en el contenedor.               |

Vite congela las variables `VITE_*` dentro del build, así que una imagen
construida con ellas quedaría atada a un solo ambiente. Para evitarlo, el
contenedor escribe `config.js` al arrancar con sus propias variables y la
aplicación lo lee desde `window.__ENV__` (ver `src/core/config/env.ts`).

El orden de resolución es: `window.__ENV__` → `import.meta.env` → valores por
defecto de desarrollo. Así **la misma imagen sirve para staging y producción**.

## Pruebas end to end

```bash
npm run test:e2e
```

Corren contra la API real y su base sembrada, no contra mocks, para validar
también los contratos.

| Spec                       | Cubre                                                       |
| -------------------------- | ----------------------------------------------------------- |
| `auth`                     | Login, sesión persistente, logout, recuperación, verificación |
| `permissions`              | Visibilidad por rol y acceso denegado por URL                |
| `reading-levels-crud`      | Patrón CRUD completo del doc 02                              |
| `stories`                  | Estados de publicación y carga de archivos                   |
| `dictionary`               | Palabras y traducciones anidadas                             |
| `users`                    | Alta, bloqueo, detalle y filtro multi-rol                    |
| `roles`                    | Matriz de permisos, catálogo de solo lectura                 |
| `learning-data`            | Vocabulario, progreso, auditoría y logs                      |
| `ui-patterns`              | Migas de pan, ordenamiento, tamaño de página, detalle        |
| `responsive`               | Drawer, tablas y modales en móvil                            |

Dos requisitos del entorno:

- La API debe estar corriendo en `http://localhost:3000`.
- La API debe tener `THROTTLE_AUTH_LIMIT` alto (100 en el `.env` de
  desarrollo). Con el valor de producción (10 por minuto), la propia suite se
  autolimita y las pruebas fallan por rate limiting en vez de por defectos.

## Despliegue con Docker

```bash
docker compose build
API_BASE_URL=https://api.tu-dominio.com/api/v1 docker compose up -d
```

La imagen usa build multi-etapa: compila con Node y sirve el resultado estático
desde nginx sin privilegios de root, en el puerto `8080`.

Puntos a cuidar en el servidor:

- `API_BASE_URL` es la URL que alcanza **el navegador del usuario**, no la red
  interna de Docker. El panel corre en el navegador, no en el contenedor.
- El origen del panel debe estar incluido en `CORS_ORIGINS` de la API. Si falta,
  el navegador bloquea las respuestas y el panel muestra «No se pudo conectar
  con el servidor», sin más pistas.
- La API debe emitir sus cookies de sesión con `COOKIE_SECURE=true` y
  `COOKIE_SAME_SITE=none` cuando el panel y la API estén en dominios distintos
  bajo HTTPS. En local, con ambos en `localhost`, se usa `false` y `lax`.
- La imagen no contiene secretos: la configuración llega por variables de
  entorno en cada arranque.
