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
 * 3. Valores por defecto para que `npm run dev` funcione sin configurar nada.
 */
declare global {
  interface Window {
    __ENV__?: Partial<Record<'API_BASE_URL' | 'APP_ENV', string>>;
  }
}

/** Un valor no reemplazado por el contenedor conserva su marcador `${...}`. */
function runtimeValue(key: 'API_BASE_URL' | 'APP_ENV'): string | undefined {
  const value = typeof window === 'undefined' ? undefined : window.__ENV__?.[key];
  return value && !value.startsWith('${') ? value : undefined;
}

export const env = {
  apiBaseUrl:
    runtimeValue('API_BASE_URL') ??
    (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
    'http://localhost:3000/api/v1',
  appEnv:
    runtimeValue('APP_ENV') ??
    (import.meta.env.VITE_APP_ENV as string | undefined) ??
    'development',
} as const;
