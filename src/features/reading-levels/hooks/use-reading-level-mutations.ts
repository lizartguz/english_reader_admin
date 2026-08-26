import { useMutation, useQueryClient } from '@tanstack/react-query';
import { readingLevelsApi } from '../api/reading-levels.api';
import { readingLevelsKeys } from './reading-levels.keys';
import type { ReadingLevelPayload } from '../types/reading-level.types';

export function useCreateReadingLevel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReadingLevelPayload) => readingLevelsApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: readingLevelsKeys.all }),
  });
}

export function useUpdateReadingLevel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ReadingLevelPayload> }) =>
      readingLevelsApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: readingLevelsKeys.all }),
  });
}

export function useDeleteReadingLevel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => readingLevelsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: readingLevelsKeys.all }),
  });
}
