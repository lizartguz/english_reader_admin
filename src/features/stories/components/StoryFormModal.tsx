import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FormModal } from '@/core/ui/forms/FormModal';
import { FormField } from '@/core/ui/forms/FormField';
import { FilterSelect } from '@/core/ui/misc/FilterSelect';
import { CircularLoader } from '@/core/ui/feedback/CircularLoader';
import { AppFeedback } from '@/core/ui/feedback/AppFeedback';
import { applyServerErrors } from '@/core/errors/error-mapper';
import { AdminMessages } from '@/core/config/constants';
import { useReadingLevelsQuery } from '@/features/reading-levels/hooks/use-reading-levels-query';
import { useGenresQuery } from '@/features/genres/hooks/use-genres-query';
import { storySchema, type StoryFormValues } from '../schemas/story.schema';
import { useCreateStory, useStoryDetailQuery, useUpdateStory } from '../hooks/use-stories';
import type { StoryListItem } from '../types/story.types';

interface StoryFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  story: StoryListItem | null;
}

/**
 * Alta y edición de historias. El contenido completo no viene en el listado,
 * así que al editar se pide el detalle antes de poblar el formulario.
 */
export function StoryFormModal({ open, onOpenChange, story }: StoryFormModalProps) {
  const isEditing = Boolean(story);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const detailQuery = useStoryDetailQuery(isEditing ? story!.id : null);
  const levelsQuery = useReadingLevelsQuery({ isActive: true, limit: 100 });
  const genresQuery = useGenresQuery({ isActive: true, limit: 100 });

  const createMutation = useCreateStory();
  const updateMutation = useUpdateStory();
  const saving = createMutation.isPending || updateMutation.isPending;

  const detail = detailQuery.data;
  const loadingDetail = isEditing && detailQuery.isLoading;

  const form = useForm<StoryFormValues>({
    resolver: zodResolver(storySchema),
    values: {
      title: detail?.title ?? story?.title ?? '',
      readingLevelId: detail?.readingLevel.id ?? story?.readingLevel.id ?? '',
      author: detail?.author ?? story?.author ?? '',
      summary: detail?.summary ?? story?.summary ?? '',
      content: detail?.content ?? '',
      estimatedReadingMinutes: String(detail?.estimatedReadingMinutes ?? story?.estimatedReadingMinutes ?? ''),
      genreIds: (detail?.genres ?? story?.genres ?? []).map((genre) => genre.id),
    },
  });

  function onSubmit(values: StoryFormValues) {
    setGeneralError(null);
    const payload = {
      title: values.title.trim(),
      readingLevelId: values.readingLevelId,
      author: values.author || undefined,
      summary: values.summary || undefined,
      content: values.content,
      estimatedReadingMinutes: values.estimatedReadingMinutes
        ? Number(values.estimatedReadingMinutes)
        : undefined,
      genreIds: values.genreIds,
    };

    const mutation = isEditing
      ? updateMutation.mutateAsync({ id: story!.id, payload })
      : createMutation.mutateAsync(payload);

    mutation
      .then(() => {
        AppFeedback.success(isEditing ? AdminMessages.UpdatedSuccess : AdminMessages.CreatedSuccess);
        onOpenChange(false);
      })
      .catch((error) => setGeneralError(applyServerErrors(error, form)));
  }

  const levelOptions = (levelsQuery.data?.items ?? []).map((level) => ({
    value: level.id,
    label: `${level.code} · ${level.name}`,
  }));

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar historia' : 'Nueva historia'}
      description={isEditing ? undefined : 'La historia se crea en borrador; publícala cuando esté lista.'}
      onSubmit={form.handleSubmit(onSubmit)}
      saving={saving}
      generalError={generalError}
      className="sm:max-w-3xl"
    >
      {loadingDetail ? (
        <CircularLoader label="Cargando historia…" />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Título" htmlFor="title" required error={form.formState.errors.title?.message}>
              <Input id="title" {...form.register('title')} />
            </FormField>
            <FormField label="Autor" htmlFor="author" error={form.formState.errors.author?.message}>
              <Input id="author" placeholder="Opcional" {...form.register('author')} />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Nivel de lectura"
              htmlFor="readingLevelId"
              required
              error={form.formState.errors.readingLevelId?.message}
            >
              <Controller
                control={form.control}
                name="readingLevelId"
                render={({ field }) => (
                  <FilterSelect
                    aria-label="Nivel de lectura"
                    value={field.value}
                    onValueChange={field.onChange}
                    options={levelOptions}
                    placeholder="Selecciona un nivel"
                    className="w-full"
                  />
                )}
              />
            </FormField>
            <FormField
              label="Minutos estimados"
              htmlFor="estimatedReadingMinutes"
              error={form.formState.errors.estimatedReadingMinutes?.message}
            >
              <Input
                id="estimatedReadingMinutes"
                type="number"
                min={1}
                placeholder="Opcional"
                {...form.register('estimatedReadingMinutes')}
              />
            </FormField>
          </div>

          <FormField label="Resumen" htmlFor="summary" error={form.formState.errors.summary?.message}>
            <Textarea id="summary" rows={2} {...form.register('summary')} />
          </FormField>

          <FormField label="Contenido" htmlFor="content" required error={form.formState.errors.content?.message}>
            <Textarea id="content" rows={8} {...form.register('content')} />
          </FormField>

          <FormField label="Géneros" htmlFor="genreIds" error={form.formState.errors.genreIds?.message}>
            <Controller
              control={form.control}
              name="genreIds"
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                  {(genresQuery.data?.items ?? []).map((genre) => (
                    <Label key={genre.id} className="flex items-center gap-2 font-normal">
                      <Checkbox
                        checked={field.value.includes(genre.id)}
                        onCheckedChange={() =>
                          field.onChange(
                            field.value.includes(genre.id)
                              ? field.value.filter((id) => id !== genre.id)
                              : [...field.value, genre.id],
                          )
                        }
                      />
                      <span className="text-sm">{genre.name}</span>
                    </Label>
                  ))}
                </div>
              )}
            />
          </FormField>
        </>
      )}
    </FormModal>
  );
}
