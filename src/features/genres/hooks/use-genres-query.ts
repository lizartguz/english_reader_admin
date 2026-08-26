import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { genresApi } from '../api/genres.api';
import { genresKeys } from './genres.keys';
import type { GenreFilters } from '../types/genre.types';

export function useGenresQuery(filters: GenreFilters) {
  return useQuery({
    queryKey: genresKeys.list(filters),
    queryFn: () => genresApi.list(filters),
    placeholderData: keepPreviousData,
  });
}
