#!/bin/sh
# Genera la configuración de ejecución del panel a partir de las variables de
# entorno del contenedor.
#
# La imagen de nginx ejecuta todos los scripts de `/docker-entrypoint.d/` antes
# de arrancar el servidor, así que esto corre en cada inicio: la misma imagen
# puede apuntar a la API de staging o a la de producción sin recompilarse.
set -eu

CONFIG_FILE="/usr/share/nginx/html/config.js"

: "${API_BASE_URL:?Falta la variable API_BASE_URL con la URL de english_reader_api}"
: "${APP_ENV:=production}"

# Se serializa con `sed` para escapar comillas y barras: un valor mal escapado
# rompería el archivo y dejaría el panel sin arrancar.
escape() {
  printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'
}

cat > "$CONFIG_FILE" <<EOF
window.__ENV__ = {
  API_BASE_URL: "$(escape "$API_BASE_URL")",
  APP_ENV: "$(escape "$APP_ENV")"
};
EOF

echo "Configuración de ambiente generada: APP_ENV=$APP_ENV, API_BASE_URL=$API_BASE_URL"
