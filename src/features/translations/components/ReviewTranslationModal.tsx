import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormField } from '@/core/ui/forms/FormField';
import { FilterSelect } from '@/core/ui/misc/FilterSelect';
import { ButtonLoader } from '@/core/ui/feedback/ButtonLoader';
import { CircularLoader } from '@/core/ui/feedback/CircularLoader';
import { AppFeedback } from '@/core/ui/feedback/AppFeedback';
import { applyServerErrors } from '@/core/errors/error-mapper';
import { toFriendlyMessage } from '@/core/errors/friendly-error';
import { TARGET_LANGUAGES } from '@/core/config/constants';
import { usePermissions } from '@/core/auth/permission-checker';
import { PermissionCode } from '@/core/permissions/permissions.enum';
import { useWordDetailQuery } from '@/features/dictionary/hooks/use-words';
import { PART_OF_SPEECH_LABELS } from '@/features/dictionary/schemas/word.schema';
import { ReviewStatusBadge } from '@/features/dictionary/components/ReviewStatusBadge';
import { useReviewTranslationGlobal, useUpdateTranslation } from '../hooks/use-translations';
import type { TranslationListItem } from '../types/translation.types';

const schema = z.object({
  translation: z
    .string()
    .min(1, 'La traducción es obligatoria.')
    .max(255, 'La traducción no puede superar 255 caracteres.'),
  meaningContext: z
    .string()
    .max(2000, 'El contexto no puede superar 2000 caracteres.')
    .optional()
    .or(z.literal('')),
  source: z.string().max(100, 'La fuente no puede superar 100 caracteres.').optional().or(z.literal('')),
  targetLanguage: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

const LANGUAGE_OPTIONS = TARGET_LANGUAGES.map((lang) => ({ value: lang.code, label: lang.label }));

/**
 * Corrige y revisa una traducción generada automáticamente.
 *
 * Muestra la palabra de origen con su definición porque juzgar «hermoso» sin
 * saber que traduce «beautiful» sería revisar a ciegas.
 */
export function ReviewTranslationModal({
  translation,
  onOpenChange,
}: {
  translation: TranslationListItem | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { hasPermission } = usePermissions();
  const canUpdate = hasPermission(PermissionCode.TranslationsUpdate);
  const canReview = hasPermission(PermissionCode.TranslationsReview);

  const [generalError, setGeneralError] = useState<string | null>(null);
  const wordQuery = useWordDetailQuery(translation?.word.id ?? null);
  const updateMutation = useUpdateTranslation();
  const reviewMutation = useReviewTranslationGlobal();
  const saving = updateMutation.isPending || reviewMutation.isPending;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      translation: translation?.translation ?? '',
      meaningContext: translation?.meaningContext ?? '',
      source: translation?.source ?? '',
      targetLanguage: translation?.targetLanguage ?? 'es',
    },
  });

  /**
   * Guardar y revisar son dos endpoints distintos. Se encadenan para que el
   * revisor corrija y apruebe en un solo gesto; si la revisión falla después
   * de guardar, se dice explícitamente en vez de reportar un éxito engañoso.
   */
  async function guardarYRevisar(values: FormValues, estado?: 'reviewed' | 'rejected') {
    if (!translation) return;
    setGeneralError(null);

    try {
      await updateMutation.mutateAsync({
        id: translation.id,
        payload: {
          translation: values.translation,
          meaningContext: values.meaningContext || null,
          source: values.source || null,
          targetLanguage: values.targetLanguage,
        },
      });
    } catch (error) {
      setGeneralError(applyServerErrors(error, form));
      return;
    }

    if (!estado) {
      AppFeedback.success('Traducción actualizada correctamente.');
      onOpenChange(false);
      return;
    }

    try {
      await reviewMutation.mutateAsync({ id: translation.id, reviewStatus: estado });
      AppFeedback.success(
        estado === 'reviewed' ? 'Traducción aprobada correctamente.' : 'Traducción rechazada correctamente.',
      );
      onOpenChange(false);
    } catch (error) {
      setGeneralError(
        `Se guardaron los cambios, pero no se pudo registrar la revisión. ${toFriendlyMessage(error)}`,
      );
    }
  }

  const palabra = wordQuery.data;

  return (
    <Dialog open={Boolean(translation)} onOpenChange={(next) => !saving && onOpenChange(next)}>
      <DialogContent className="sm:max-w-xl" data-testid="review-translation-modal">
        <form onSubmit={form.handleSubmit((values) => guardarYRevisar(values))} noValidate>
          <DialogHeader>
            <DialogTitle>Revisar traducción</DialogTitle>
            <DialogDescription>
              Corrige el texto si hace falta y registra si la traducción es correcta.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[55vh] space-y-4 overflow-y-auto py-4">
            {/* Contexto de la palabra: solo lectura, imprescindible para juzgar. */}
            <div className="space-y-1 rounded-md bg-muted p-3">
              {wordQuery.isLoading ? (
                <CircularLoader size="sm" label="Cargando palabra…" />
              ) : (
                <>
                  <p className="flex flex-wrap items-baseline gap-x-3 text-sm font-medium text-foreground">
                    {translation?.word.word}
                    {palabra?.phonetic && (
                      <span className="text-xs font-normal text-muted-foreground">{palabra.phonetic}</span>
                    )}
                    {palabra?.partOfSpeech && (
                      <span className="text-xs font-normal text-muted-foreground">
                        {PART_OF_SPEECH_LABELS[palabra.partOfSpeech]}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {palabra?.definitionEn ?? 'Sin definición registrada.'}
                  </p>
                </>
              )}
            </div>

            <FormField
              label="Traducción"
              htmlFor="translation"
              required
              error={form.formState.errors.translation?.message}
            >
              <Input id="translation" disabled={!canUpdate} {...form.register('translation')} />
            </FormField>

            <FormField
              label="Contexto de significado"
              htmlFor="meaningContext"
              error={form.formState.errors.meaningContext?.message}
              description="Cuándo aplica esta acepción."
            >
              <Input id="meaningContext" disabled={!canUpdate} {...form.register('meaningContext')} />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Fuente" htmlFor="source" error={form.formState.errors.source?.message}>
                <Input id="source" disabled={!canUpdate} {...form.register('source')} />
              </FormField>
              <FormField label="Idioma destino" htmlFor="targetLanguage">
                <Controller
                  control={form.control}
                  name="targetLanguage"
                  render={({ field }) => (
                    <FilterSelect
                      aria-label="Idioma destino"
                      value={field.value}
                      onValueChange={field.onChange}
                      options={LANGUAGE_OPTIONS}
                      className="w-full"
                    />
                  )}
                />
              </FormField>
            </div>

            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              Estado actual:
              {translation && <ReviewStatusBadge status={translation.reviewStatus} />}
              {translation?.reviewedBy && <span className="text-xs">por {translation.reviewedBy.fullName}</span>}
            </p>

            {generalError && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                {generalError}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" disabled={saving} onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>

            {canReview && (
              <ButtonLoader
                type="button"
                variant="destructive"
                loading={saving}
                onClick={form.handleSubmit((values) => guardarYRevisar(values, 'rejected'))}
              >
                <X /> Rechazar
              </ButtonLoader>
            )}

            <ButtonLoader
              type="button"
              loading={saving}
              loadingText="Guardando…"
              data-testid="save-and-approve"
              onClick={form.handleSubmit((values) =>
                guardarYRevisar(values, canReview ? 'reviewed' : undefined),
              )}
            >
              <Check /> {canReview ? 'Guardar y aprobar' : 'Guardar'}
            </ButtonLoader>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
