import { useEffect, useState } from 'react';

/** Retraso por defecto: cómodo al escribir sin que la tabla se sienta lenta. */
export const DEFAULT_DEBOUNCE_MS = 350;

/**
 * Devuelve el valor recibido, pero solo después de que deje de cambiar.
 *
 * Los filtros de texto forman parte de la clave de consulta de TanStack Query,
 * así que sin este retraso cada tecla pulsada dispara una petición completa al
 * servidor (búsqueda con `LIKE` más su conteo de paginación). El estado del
 * input sigue siendo inmediato: lo único que se retrasa es el valor que llega
 * a la consulta, de modo que escribir se siente igual de fluido.
 *
 * No se aplica a los selectores: ahí el usuario elige una opción concreta y
 * espera que la tabla reaccione en el acto.
 */
export function useDebouncedValue<T>(value: T, delay: number = DEFAULT_DEBOUNCE_MS): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
