# ==========================================================
# English Reader Admin - imagen de producción
#
# Build multi-etapa: se compila el panel con Node y se sirve el resultado
# estático desde nginx. La imagen no contiene secretos ni la URL de la API:
# esa configuración se inyecta al arrancar el contenedor (`docker/30-config.sh`),
# de modo que una misma imagen sirva en staging y en producción.
# ==========================================================

# ----- Etapa 1: compilación -----
FROM node:22-alpine AS build

WORKDIR /app

# Se copian primero los manifiestos para aprovechar la caché de capas: mientras
# las dependencias no cambien, no se reinstalan al modificar el código.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# El build no recibe VITE_API_BASE_URL a propósito: la URL real se resuelve en
# tiempo de ejecución desde `window.__ENV__`.
RUN npm run build

# ----- Etapa 2: servidor estático -----
# Imagen sin privilegios: corre como usuario no root y escucha en el 8080.
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html

# La configuración de nginx entra como plantilla, no como archivo final: el
# entrypoint de la imagen sustituye `${API_ORIGIN}` en la cabecera
# Content-Security-Policy antes de arrancar, con el origen real de cada
# ambiente. `15-csp-origin.envsh` lo calcula y `30-config.sh` genera el
# `config.js` que consume el navegador.
COPY docker/default.conf.template /etc/nginx/templates/default.conf.template
COPY docker/15-csp-origin.envsh /docker-entrypoint.d/15-csp-origin.envsh
COPY docker/30-config.sh /docker-entrypoint.d/30-config.sh

USER root
RUN chmod +x /docker-entrypoint.d/15-csp-origin.envsh /docker-entrypoint.d/30-config.sh
USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1
