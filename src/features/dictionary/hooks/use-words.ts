import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { wordsApi } from '../api/words.api';
import type { ReviewStatus, TranslationPayload, WordFilters, WordPayload } from '../types/word.types';

export const wordsKeys = {
  all: ['words'] as const,
  list: (filters: WordFilters) => ['words', 'list', filters] as const,
  detail: (id: string) => ['words', 'detail', id] as const,
  translations: (wordId: string) => ['words', 'translations', wordId] as const,
};

export function useWordsQuery(filters: WordFilters) {
  return useQuery({
    queryKey: wordsKeys.list(filters),
    queryFn: () => wordsApi.list(filters),
    placeholderData: keepPreviousData,
  });
}

/** Detalle con ejemplos, pronunciaciones y traducciones; solo al abrirlo. */
export function useWordDetailQuery(wordId: string | null) {
  return useQuery({
    queryKey: wordsKeys.detail(wordId ?? ''),
    queryFn: () => wordsApi.detail(wordId!),
    enabled: Boolean(wordId),
  });
}

export function useWordTranslationsQuery(wordId: string | null) {
  return useQuery({
    queryKey: wordsKeys.translations(wordId ?? ''),
    queryFn: () => wordsApi.listTranslations(wordId!),
    enabled: Boolean(wordId),
  });
}

/** Invalida listado y traducciones tras cualquier mutación del diccionario. */
function useDictionaryInvalidation() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: wordsKeys.all });
}

export function useCreateWord() {
  const invalidate = useDictionaryInvalidation();
  return useMutation({ mutationFn: (payload: WordPayload) => wordsApi.create(payload), onSuccess: invalidate });
}

export function useUpdateWord() {
  const invalidate = useDictionaryInvalidation();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<WordPayload> }) => wordsApi.update(id, payload),
    onSuccess: invalidate,
  });
}

export function useReviewWord() {
  const invalidate = useDictionaryInvalidation();
  return useMutation({
    mutationFn: ({ id, reviewStatus }: { id: string; reviewStatus: ReviewStatus }) =>
      wordsApi.review(id, reviewStatus),
    onSuccess: invalidate,
  });
}

export function useDeleteWord() {
  const invalidate = useDictionaryInvalidation();
  return useMutation({ mutationFn: (id: string) => wordsApi.remove(id), onSuccess: invalidate });
}

export function useCreateTranslation() {
  const invalidate = useDictionaryInvalidation();
  return useMutation({
    mutationFn: ({ wordId, payload }: { wordId: string; payload: TranslationPayload }) =>
      wordsApi.createTranslation(wordId, payload),
    onSuccess: invalidate,
  });
}

export function useReviewTranslation() {
  const invalidate = useDictionaryInvalidation();
  return useMutation({
    mutationFn: ({ id, reviewStatus }: { id: string; reviewStatus: ReviewStatus }) =>
      wordsApi.reviewTranslation(id, reviewStatus),
    onSuccess: invalidate,
  });
}

export function useDeleteTranslation() {
  const invalidate = useDictionaryInvalidation();
  return useMutation({ mutationFn: (id: string) => wordsApi.removeTranslation(id), onSuccess: invalidate });
}
