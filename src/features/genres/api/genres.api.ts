import { request, requestPaginated } from '@/core/api/api-client';
import type { PaginatedResult } from '@/core/api/api-response';
import type { Genre, GenreFilters, GenrePayload } from '../types/genre.types';

const BASE_URL = '/admin/genres';

export const genresApi = {
  list: (filters: GenreFilters): Promise<PaginatedResult<Genre>> =>
    requestPaginated<Genre>({ url: BASE_URL, params: filters }),

  create: (payload: GenrePayload) => request<Genre>({ method: 'POST', url: BASE_URL, data: payload }),

  update: (id: string, payload: Partial<GenrePayload>) =>
    request<Genre>({ method: 'PATCH', url: `${BASE_URL}/${id}`, data: payload }),

  remove: (id: string) => request<null>({ method: 'DELETE', url: `${BASE_URL}/${id}` }),
};
