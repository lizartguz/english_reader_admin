import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { vocabularyApi } from '../api/vocabulary.api';
import type { VocabularyFilters } from '../types/vocabulary.types';

export const vocabularyKeys = {
  all: ['vocabulary'] as const,
  list: (filters: VocabularyFilters) => ['vocabulary', 'list', filters] as const,
};

export function useVocabularyQuery(filters: VocabularyFilters) {
  return useQuery({
    queryKey: vocabularyKeys.list(filters),
    queryFn: () => vocabularyApi.list(filters),
    placeholderData: keepPreviousData,
  });
}
