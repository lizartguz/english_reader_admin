import { request, requestPaginated } from '@/core/api/api-client';
import type { PaginatedResult } from '@/core/api/api-response';
import type { ReadingLevel, ReadingLevelFilters, ReadingLevelPayload } from '../types/reading-level.types';

const BASE_URL = '/admin/reading-levels';

export const readingLevelsApi = {
  list: (filters: ReadingLevelFilters): Promise<PaginatedResult<ReadingLevel>> =>
    requestPaginated<ReadingLevel>({ url: BASE_URL, params: filters }),

  create: (payload: ReadingLevelPayload) =>
    request<ReadingLevel>({ method: 'POST', url: BASE_URL, data: payload }),

  update: (id: string, payload: Partial<ReadingLevelPayload>) =>
    request<ReadingLevel>({ method: 'PATCH', url: `${BASE_URL}/${id}`, data: payload }),

  remove: (id: string) => request<null>({ method: 'DELETE', url: `${BASE_URL}/${id}` }),
};
