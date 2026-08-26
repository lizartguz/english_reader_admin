import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { readingProgressApi } from '../api/reading-progress.api';
import type { ReadingProgressFilters } from '../types/reading-progress.types';

export const readingProgressKeys = {
  all: ['reading-progress'] as const,
  list: (filters: ReadingProgressFilters) => ['reading-progress', 'list', filters] as const,
};

export function useReadingProgressQuery(filters: ReadingProgressFilters) {
  return useQuery({
    queryKey: readingProgressKeys.list(filters),
    queryFn: () => readingProgressApi.list(filters),
    placeholderData: keepPreviousData,
  });
}
