import { useMutation, useQueryClient } from '@tanstack/react-query';
import { genresApi } from '../api/genres.api';
import { genresKeys } from './genres.keys';
import type { GenrePayload } from '../types/genre.types';

export function useCreateGenre() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GenrePayload) => genresApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: genresKeys.all }),
  });
}

export function useUpdateGenre() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<GenrePayload> }) => genresApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: genresKeys.all }),
  });
}

export function useDeleteGenre() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => genresApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: genresKeys.all }),
  });
}
