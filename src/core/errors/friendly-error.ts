import { AdminMessages } from '@/core/config/constants';
import { ApiError, ApiUnavailableError } from '@/core/api/api-error';
import { ErrorCode } from '@/core/api/error-code.enum';

/**
 * Convierte cualquier error capturado en un mensaje amigable en español.
 * Nunca debe mostrarse un `message` crudo que no venga de la API, ni SQL,
 * stack traces o nombres internos de clases.
 */
export function toFriendlyMessage(error: unknown): string {
  if (error instanceof ApiUnavailableError) {
    return AdminMessages.ApiUnavailable;
  }

  if (error instanceof ApiError) {
    if (error.code === ErrorCode.Forbidden) return AdminMessages.Forbidden;
    if (error.code === ErrorCode.InternalError) return AdminMessages.GenericError;
    // El backend garantiza que `message` ya es un texto amigable en español.
    return error.message || AdminMessages.GenericError;
  }

  return AdminMessages.GenericError;
}
