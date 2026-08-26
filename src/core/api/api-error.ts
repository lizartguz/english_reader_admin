import type { ApiErrorDetail } from './api-response';
import type { ErrorCode } from './error-code.enum';

/**
 * Error normalizado que propagan los servicios de cada feature.
 * Envuelve el `code` y los `errors` por campo que devuelve la API.
 */
export class ApiError extends Error {
  readonly code: ErrorCode | string;
  readonly errors: ApiErrorDetail[];
  readonly status?: number;

  constructor(message: string, code: ErrorCode | string, errors: ApiErrorDetail[] = [], status?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.errors = errors;
    this.status = status;
  }

  /** Mensaje de error para un campo específico, si la API lo indicó. */
  fieldError(field: string): string | undefined {
    return this.errors.find((error) => error.field === field)?.message;
  }
}

/** Error sin respuesta del servidor (red caída, timeout, CORS). */
export class ApiUnavailableError extends Error {
  constructor() {
    super('No se pudo conectar con el servidor.');
    this.name = 'ApiUnavailableError';
  }
}
