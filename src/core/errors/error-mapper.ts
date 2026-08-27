import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { ApiError } from '@/core/api/api-error';
import { toFriendlyMessage } from './friendly-error';

/**
 * Comprueba que una ruta de campo exista realmente en el formulario.
 *
 * La API nombra los campos anidados con notación de punto
 * (`translations.0.targetLanguage`), así que se recorre el objeto de valores
 * clave por clave. Se mira la **existencia** de la clave, no su valor: un campo
 * opcional vacío sigue siendo un campo del formulario.
 */
function existeCampo(values: unknown, path: string): boolean {
  let actual: unknown = values;

  for (const clave of path.split('.')) {
    if (typeof actual !== 'object' || actual === null || !(clave in actual)) {
      return false;
    }
    actual = (actual as Record<string, unknown>)[clave];
  }

  return true;
}

/**
 * Aplica al formulario los errores por campo que devolvió la API y devuelve el
 * mensaje general que debe mostrar el modal.
 *
 * Un error solo se delega al campo cuando ese campo existe en el formulario. Si
 * la API se queja de algo que el formulario no muestra —un campo que no se
 * renderiza, o uno que ni siquiera forma parte de él— el mensaje se sube al
 * error general en vez de perderse: guardar sin que ocurra nada y sin explicar
 * por qué es el peor desenlace posible para quien está llenando el formulario.
 */
export function applyServerErrors<T extends FieldValues>(
  error: unknown,
  form: Pick<UseFormReturn<T>, 'setError' | 'getValues'>,
): string {
  if (error instanceof ApiError && error.errors.length > 0) {
    const values = form.getValues();
    const sinCampo: string[] = [];

    for (const detail of error.errors) {
      if (detail.field && existeCampo(values, detail.field)) {
        form.setError(detail.field as Path<T>, { type: 'server', message: detail.message });
      } else {
        sinCampo.push(detail.message);
      }
    }

    if (sinCampo.length === 0) {
      return '';
    }

    // Se listan todos: si la API señala dos problemas que el formulario no
    // puede ubicar, mostrar solo uno dejaría el segundo invisible.
    return sinCampo.join(' ');
  }

  return toFriendlyMessage(error);
}
