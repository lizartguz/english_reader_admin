import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { translationsApi } from '../api/translations.api';
import type {
  ReviewStatus,
  TranslationFilters,
  UpdateTranslationPayload,
} from '../types/translation.types';

export const translationsKeys = {
  all: ['translations'] as const,
  list: (filters: TranslationFilters) => ['translations', 'list', filters] as const,
};

export function useTranslationsQuery(filters: TranslationFilters) {
  return useQuery({
    queryKey: translationsKeys.list(filters),
    queryFn: () => translationsApi.list(filters),
    placeholderData: keepPreviousData,
  });
}

/**
 * Invalida tanto las traducciones como el diccionario: una traducción también
 * se ve desde el detalle de su palabra y en el contador de la tabla.
 */
function useTranslationsInvalidation() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: translationsKeys.all });
    void queryClient.invalidateQueries({ queryKey: ['words'] });
    void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };
}

export function useUpdateTranslation() {
  const invalidate = useTranslationsInvalidation();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTranslationPayload }) =>
      translationsApi.update(id, payload),
    onSuccess: invalidate,
  });
}

export function useReviewTranslationGlobal() {
  const invalidate = useTranslationsInvalidation();
  return useMutation({
    mutationFn: ({ id, reviewStatus }: { id: string; reviewStatus: ReviewStatus }) =>
      translationsApi.review(id, reviewStatus),
    onSuccess: invalidate,
  });
}

export function useDeleteTranslationGlobal() {
  const invalidate = useTranslationsInvalidation();
  return useMutation({ mutationFn: (id: string) => translationsApi.remove(id), onSuccess: invalidate });
}
