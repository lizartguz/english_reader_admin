import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { storiesApi } from '../api/stories.api';
import type {
  CreateStoryPayload,
  StoryAssetType,
  StoryFilters,
  StoryStatus,
  UpdateStoryPayload,
} from '../types/story.types';

export const storiesKeys = {
  all: ['stories'] as const,
  list: (filters: StoryFilters) => ['stories', 'list', filters] as const,
  detail: (id: string) => ['stories', 'detail', id] as const,
};

export function useStoriesQuery(filters: StoryFilters) {
  return useQuery({
    queryKey: storiesKeys.list(filters),
    queryFn: () => storiesApi.list(filters),
    placeholderData: keepPreviousData,
  });
}

/** Detalle con contenido y recursos; solo se pide cuando hace falta. */
export function useStoryDetailQuery(id: string | null) {
  return useQuery({
    queryKey: storiesKeys.detail(id ?? ''),
    queryFn: () => storiesApi.detail(id!),
    enabled: Boolean(id),
  });
}

function useStoriesInvalidation() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: storiesKeys.all });
}

export function useCreateStory() {
  const invalidate = useStoriesInvalidation();
  return useMutation({ mutationFn: (payload: CreateStoryPayload) => storiesApi.create(payload), onSuccess: invalidate });
}

export function useUpdateStory() {
  const invalidate = useStoriesInvalidation();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateStoryPayload }) => storiesApi.update(id, payload),
    onSuccess: invalidate,
  });
}

export function useChangeStoryStatus() {
  const invalidate = useStoriesInvalidation();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: StoryStatus }) => storiesApi.changeStatus(id, status),
    onSuccess: invalidate,
  });
}

export function useDeleteStory() {
  const invalidate = useStoriesInvalidation();
  return useMutation({ mutationFn: (id: string) => storiesApi.remove(id), onSuccess: invalidate });
}

export function useUploadStoryAsset() {
  const invalidate = useStoriesInvalidation();
  return useMutation({
    mutationFn: ({ storyId, file, type }: { storyId: string; file: File; type: StoryAssetType }) =>
      storiesApi.uploadAsset(storyId, file, type),
    onSuccess: invalidate,
  });
}

export function useDeleteStoryAsset() {
  const invalidate = useStoriesInvalidation();
  return useMutation({ mutationFn: (assetId: string) => storiesApi.deleteAsset(assetId), onSuccess: invalidate });
}
