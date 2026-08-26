import { requestPaginated } from '@/core/api/api-client';
import type { PaginatedResult } from '@/core/api/api-response';
import type { VocabularyEntry, VocabularyFilters } from '../types/vocabulary.types';

const BASE_URL = '/admin/vocabulary';

export const vocabularyApi = {
  list: (filters: VocabularyFilters): Promise<PaginatedResult<VocabularyEntry>> =>
    requestPaginated<VocabularyEntry>({ url: BASE_URL, params: filters }),
};
