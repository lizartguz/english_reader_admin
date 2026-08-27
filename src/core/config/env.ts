/**
 * Configuración de ambiente centralizada. El resto del código nunca debe leer
 * `import.meta.env` ni `window` directamente.
 *
 * El orden de resolución permite construir **una sola imagen** y desplegarla en
 * cualquier ambiente (doc 05):
 *
 * 1. `window.__ENV__`: lo escribe el contenedor al arrancar, desde sus
 *    variables de entorno. Es lo que se usa en staging y producción.
 * 2. `import.meta.env`: valores congelados en el build, útiles en desarrollo
 *    local con `.env.development`.
 * 3. Valor por defecto para que `npm run dev` funcione sin configurar nada.
 *    **Solo en desarrollo** (ver `resolveApiBaseUrl`).
 */
declare global {
  interface Window {
    __ENV__?: Partial<Record<'API_BASE_URL' | 'APP_ENV', string>>;
  }
}

const DEV_API_BASE_URL = 'http://localhost:3000/api/v1';

/** Un valor no reemplazado por el contenedor conserva su marcador `${...}`. */
function runtimeValue(key: 'API_BASE_URL' | 'APP_ENV'): string | undefined {
  const value = typeof window === 'undefined' ? undefined : window.__ENV__?.[key];
  return value && !value.startsWith('${') ? value : undefined;
}

const appEnv =
  runtimeValue('APP_ENV') ?? (import.meta.env.VITE_APP_ENV as string | undefined) ?? 'development';

/**
 * Resuelve la URL de la API, con una regla distinta según el ambiente.
 *
 * En desarrollo se cae al `localhost` de siempre para que arrancar no requiera
 * configurar nada. Fuera de desarrollo ese respaldo sería una trampa: si el
 * contenedor no escribe `config.js` o no recibe `API_BASE_URL`, el panel
 * desplegado apuntaría al `localhost` **del navegador de quien lo visita** y el
 * fallo se vería como «No se pudo conectar con el servidor», idéntico a una API
 * caída o a un origen ausente de `CORS_ORIGINS`. Es preferible fallar de
 * inmediato y decir exactamente qué falta.
 */
function resolveApiBaseUrl(): string {
  const configured =
    runtimeValue('API_BASE_URL') ?? (import.meta.env.VITE_API_BASE_URL as string | undefined);

  if (configured) return configured;

  if (appEnv !== 'development') {
    throw new Error(
      `Falta la URL de la API: el ambiente "${appEnv}" requiere API_BASE_URL. ` +
        'Verifica que el contenedor reciba esa variable y que config.js se esté sirviendo.',
    );
  }

  return DEV_API_BASE_URL;
}

export const env = {
  apiBaseUrl: resolveApiBaseUrl(),
  appEnv,
} as const;
