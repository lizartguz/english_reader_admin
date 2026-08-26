import type { GenreFilters } from '../types/genre.types';

export const genresKeys = {
  all: ['genres'] as const,
  list: (filters: GenreFilters) => ['genres', 'list', filters] as const,
};
