import { request, requestPaginated } from '@/core/api/api-client';
import type { PaginatedResult } from '@/core/api/api-response';
import type {
  ReviewStatus,
  TranslationPayload,
  WordDetail,
  WordFilters,
  WordListItem,
  WordPayload,
  WordTranslation,
} from '../types/word.types';

const WORDS_URL = '/admin/words';
const TRANSLATIONS_URL = '/admin/translations';

export const wordsApi = {
  list: (filters: WordFilters): Promise<PaginatedResult<WordListItem>> =>
    requestPaginated<WordListItem>({ url: WORDS_URL, params: filters }),

  detail: (id: string) => request<WordDetail>({ url: `${WORDS_URL}/${id}` }),

  create: (payload: WordPayload) => request<WordDetail>({ method: 'POST', url: WORDS_URL, data: payload }),

  update: (id: string, payload: Partial<WordPayload>) =>
    request<WordDetail>({ method: 'PATCH', url: `${WORDS_URL}/${id}`, data: payload }),

  review: (id: string, reviewStatus: ReviewStatus) =>
    request<WordDetail>({ method: 'PATCH', url: `${WORDS_URL}/${id}/review`, data: { reviewStatus } }),

  remove: (id: string) => request<null>({ method: 'DELETE', url: `${WORDS_URL}/${id}` }),

  /** Traducciones anidadas bajo cada palabra. */
  listTranslations: (wordId: string) =>
    requestPaginated<WordTranslation>({ url: `${WORDS_URL}/${wordId}/translations`, params: { limit: 50 } }),

  createTranslation: (wordId: string, payload: TranslationPayload) =>
    request<WordTranslation>({ method: 'POST', url: `${WORDS_URL}/${wordId}/translations`, data: payload }),

  updateTranslation: (id: string, payload: Partial<TranslationPayload>) =>
    request<WordTranslation>({ method: 'PATCH', url: `${TRANSLATIONS_URL}/${id}`, data: payload }),

  reviewTranslation: (id: string, reviewStatus: ReviewStatus) =>
    request<WordTranslation>({
      method: 'PATCH',
      url: `${TRANSLATIONS_URL}/${id}/review`,
      data: { reviewStatus },
    }),

  removeTranslation: (id: string) => request<null>({ method: 'DELETE', url: `${TRANSLATIONS_URL}/${id}` }),
};
