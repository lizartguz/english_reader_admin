import type { ReadingLevelFilters } from '../types/reading-level.types';

export const readingLevelsKeys = {
  all: ['reading-levels'] as const,
  list: (filters: ReadingLevelFilters) => ['reading-levels', 'list', filters] as const,
};
