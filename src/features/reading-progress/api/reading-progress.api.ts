import { requestPaginated } from '@/core/api/api-client';
import type { PaginatedResult } from '@/core/api/api-response';
import type { ReadingProgressEntry, ReadingProgressFilters } from '../types/reading-progress.types';

const BASE_URL = '/admin/reading-progress';

export const readingProgressApi = {
  list: (filters: ReadingProgressFilters): Promise<PaginatedResult<ReadingProgressEntry>> =>
    requestPaginated<ReadingProgressEntry>({ url: BASE_URL, params: filters }),
};
