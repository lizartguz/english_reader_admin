/**
 * Convierte un rango `YYYY-MM-DD` de los inputs de fecha al ISO 8601 que
 * esperan los filtros de la API, cubriendo el día completo en ambos extremos.
 *
 * El límite superior lleva `.999` milisegundos a propósito: con `23:59:59` a
 * secas, todo lo ocurrido dentro de ese último segundo quedaba fuera del
 * filtro. Las fechas se interpretan en la zona horaria de quien consulta —que
 * es como piensa en «su» día— y `toISOString` las lleva a UTC, que es como las
 * almacena la API.
 */
export function toIsoRange(from: string, to: string) {
  return {
    dateFrom: from ? new Date(`${from}T00:00:00.000`).toISOString() : undefined,
    dateTo: to ? new Date(`${to}T23:59:59.999`).toISOString() : undefined,
  };
}
