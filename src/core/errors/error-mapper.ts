import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { ApiError } from '@/core/api/api-error';
import { toFriendlyMessage } from './friendly-error';

/**
 * Aplica los errores por campo que devolvió la API a un formulario de
 * react-hook-form y devuelve el mensaje general a mostrar en el modal
 * (errores sin campo asociado, o cualquier error no controlado).
 */
export function applyServerErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
): string {
  if (error instanceof ApiError && error.errors.length > 0) {
    let hasGeneralError = false;

    for (const detail of error.errors) {
      if (detail.field) {
        setError(detail.field as Path<T>, { type: 'server', message: detail.message });
      } else {
        hasGeneralError = true;
      }
    }

    if (!hasGeneralError) {
      return '';
    }
  }

  return toFriendlyMessage(error);
}
