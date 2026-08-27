import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Plus, Trash2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/core/ui/forms/FormField';
import { ButtonLoader } from '@/core/ui/feedback/ButtonLoader';
import { CircularLoader } from '@/core/ui/feedback/CircularLoader';
import { EmptyState } from '@/core/ui/feedback/EmptyState';
import { AppFeedback } from '@/core/ui/feedback/AppFeedback';
import { ConfirmDialog } from '@/core/ui/feedback/ConfirmDialog';
import { applyServerErrors } from '@/core/errors/error-mapper';
import { toFriendlyMessage } from '@/core/errors/friendly-error';
import { AdminMessages } from '@/core/config/constants';
import { usePermissions } from '@/core/auth/permission-checker';
import { PermissionCode } from '@/core/permissions/permissions.enum';
import { ReviewStatusBadge } from './ReviewStatusBadge';
import { translationSchema, type TranslationFormValues } from '../schemas/word.schema';
import {
  useCreateTranslation,
  useDeleteTranslation,
  useReviewTranslation,
  useWordTranslationsQuery,
} from '../hooks/use-words';
import type { WordListItem, WordTranslation } from '../types/word.types';

interface WordTranslationsModalProps {
  word: WordListItem | null;
  onOpenChange: (open: boolean) => void;
}

/**
 * Gestiona las traducciones de una palabra. Se resuelve dentro de la palabra
 * porque así las expone la API (`/admin/words/:wordId/translations`).
 */
export function WordTranslationsModal({ word, onOpenChange }: WordTranslationsModalProps) {
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission(PermissionCode.TranslationsCreate);
  const canReview = hasPermission(PermissionCode.TranslationsReview);
  const canDelete = hasPermission(PermissionCode.TranslationsDelete);

  const [generalError, setGeneralError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<WordTranslation | null>(null);

  const query = useWordTranslationsQuery(word?.id ?? null);
  const createMutation = useCreateTranslation();
  const reviewMutation = useReviewTranslation();
  const deleteMutation = useDeleteTranslation();

  const form = useForm<TranslationFormValues>({
    resolver: zodResolver(translationSchema),
    defaultValues: { translation: '', meaningContext: '' },
  });

  function onSubmit(values: TranslationFormValues) {
    if (!word) return;
    setGeneralError(null);

    createMutation
      .mutateAsync({
        wordId: word.id,
        payload: { translation: values.translation, meaningContext: values.meaningContext || null },
      })
      .then(() => {
        AppFeedback.success('Traducción creada correctamente.');
        form.reset({ translation: '', meaningContext: '' });
      })
      .catch((error) => setGeneralError(applyServerErrors(error, form)));
  }

  function review(translation: WordTranslation, reviewStatus: 'reviewed' | 'rejected') {
    reviewMutation.mutate(
      { id: translation.id, reviewStatus },
      {
        onSuccess: () => AppFeedback.success(AdminMessages.UpdatedSuccess),
        onError: (error) => AppFeedback.error({ title: toFriendlyMessage(error) }),
      },
    );
  }

  function confirmDelete() {
    if (!deleting) return;
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        AppFeedback.success(AdminMessages.DeletedSuccess);
        setDeleting(null);
      },
      onError: (error) => AppFeedback.error({ title: toFriendlyMessage(error) }),
    });
  }

  const translations = query.data?.items ?? [];

  return (
    <>
      <Dialog open={Boolean(word)} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Traducciones de «{word?.word}»</DialogTitle>
            <DialogDescription>Consulta, agrega y revisa las traducciones al español.</DialogDescription>
          </DialogHeader>

          <div className="max-h-[45vh] space-y-2 overflow-y-auto py-2">
            {query.isLoading && <CircularLoader />}
            {!query.isLoading && translations.length === 0 && (
              <EmptyState title="Sin traducciones" description="Esta palabra aún no tiene traducciones." />
            )}
            {translations.map((translation) => (
              <div key={translation.id} className="flex items-start justify-between gap-3 rounded-md border p-2.5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{translation.translation}</p>
                  {translation.meaningContext && (
                    <p className="text-xs text-muted-foreground">{translation.meaningContext}</p>
                  )}
                  <div className="mt-1 flex items-center gap-2">
                    <ReviewStatusBadge status={translation.reviewStatus} />
                    <span className="text-xs text-muted-foreground">{translation.source ?? '—'}</span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {canReview && translation.reviewStatus !== 'reviewed' && (
                    <Button variant="ghost" size="icon-sm" title="Aprobar" onClick={() => review(translation, 'reviewed')}>
                      <Check className="text-emerald-600" />
                      <span className="sr-only">Aprobar traducción</span>
                    </Button>
                  )}
                  {canReview && translation.reviewStatus !== 'rejected' && (
                    <Button variant="ghost" size="icon-sm" title="Rechazar" onClick={() => review(translation, 'rejected')}>
                      <X className="text-destructive" />
                      <span className="sr-only">Rechazar traducción</span>
                    </Button>
                  )}
                  {canDelete && (
                    <Button variant="ghost" size="icon-sm" title="Eliminar" onClick={() => setDeleting(translation)}>
                      <Trash2 className="text-destructive" />
                      <span className="sr-only">Eliminar traducción</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {canCreate && (
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-3 border-t pt-3">
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  label="Nueva traducción"
                  htmlFor="translation"
                  required
                  error={form.formState.errors.translation?.message}
                >
                  <Input id="translation" placeholder="hermoso" {...form.register('translation')} />
                </FormField>
                <FormField
                  label="Contexto"
                  htmlFor="meaningContext"
                  error={form.formState.errors.meaningContext?.message}
                >
                  <Input id="meaningContext" placeholder="Opcional" {...form.register('meaningContext')} />
                </FormField>
              </div>

              {generalError && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                  {generalError}
                </p>
              )}

              <ButtonLoader type="submit" loading={createMutation.isPending} loadingText="Agregando…">
                <Plus /> Agregar traducción
              </ButtonLoader>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="¿Deseas eliminar esta traducción?"
        description="Dejará de mostrarse en la aplicación móvil."
        confirmLabel="Eliminar"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />
    </>
  );
}
