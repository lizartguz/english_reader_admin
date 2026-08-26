/** Metadatos de paginación devueltos en `meta.pagination`. */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/** Envoltura de éxito `{ success, message, data, meta }` de english_reader_api. */
export interface ApiSuccessEnvelope<T> {
  success: true;
  message: string;
  data: T;
  meta?: { pagination?: PaginationMeta } & Record<string, unknown>;
}

/** Detalle de un error de validación o de negocio por campo. */
export interface ApiErrorDetail {
  field?: string;
  message: string;
}

/** Envoltura de error `{ success, message, code, errors }`. */
export interface ApiErrorEnvelope {
  success: false;
  message: string;
  code: string;
  errors: ApiErrorDetail[];
}

/** Resultado normalizado de un listado paginado para consumo en features. */
export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}
