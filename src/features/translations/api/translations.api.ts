import { request, requestPaginated } from '@/core/api/api-client';
import type { PaginatedResult } from '@/core/api/api-response';
import type {
  ReviewStatus,
  TranslationFilters,
  TranslationListItem,
  UpdateTranslationPayload,
} from '../types/translation.types';

const BASE_URL = '/admin/translations';

/**
 * Listado global de traducciones. El alta no vive aquí: una traducción
 * siempre pertenece a una palabra, así que se crea desde el formulario de la
 * palabra (`POST /admin/words/:wordId/translations`).
 */
export const translationsApi = {
  list: (filters: TranslationFilters): Promise<PaginatedResult<TranslationListItem>> =>
    requestPaginated<TranslationListItem>({ url: BASE_URL, params: filters }),

  update: (id: string, payload: UpdateTranslationPayload) =>
    request<TranslationListItem>({ method: 'PATCH', url: `${BASE_URL}/${id}`, data: payload }),

  review: (id: string, reviewStatus: ReviewStatus) =>
    request<TranslationListItem>({
      method: 'PATCH',
      url: `${BASE_URL}/${id}/review`,
      data: { reviewStatus },
    }),

  remove: (id: string) => request<null>({ method: 'DELETE', url: `${BASE_URL}/${id}` }),
};
