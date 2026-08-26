import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { readingLevelsApi } from '../api/reading-levels.api';
import { readingLevelsKeys } from './reading-levels.keys';
import type { ReadingLevelFilters } from '../types/reading-level.types';

export function useReadingLevelsQuery(filters: ReadingLevelFilters) {
  return useQuery({
    queryKey: readingLevelsKeys.list(filters),
    queryFn: () => readingLevelsApi.list(filters),
    placeholderData: keepPreviousData,
  });
}
