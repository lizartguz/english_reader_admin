/**
 * Convierte un rango `YYYY-MM-DD` de los inputs de fecha al ISO 8601 que
 * esperan los filtros de la API, cubriendo el día completo en ambos extremos.
 */
export function toIsoRange(from: string, to: string) {
  return {
    dateFrom: from ? new Date(`${from}T00:00:00`).toISOString() : undefined,
    dateTo: to ? new Date(`${to}T23:59:59`).toISOString() : undefined,
  };
}
