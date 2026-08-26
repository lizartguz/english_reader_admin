import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FormModal } from '@/core/ui/forms/FormModal';
import { FormField } from '@/core/ui/forms/FormField';
import { AppFeedback } from '@/core/ui/feedback/AppFeedback';
import { applyServerErrors } from '@/core/errors/error-mapper';
import { AdminMessages } from '@/core/config/constants';
import { genreSchema, type GenreFormValues } from '../schemas/genre.schema';
import { useCreateGenre, useUpdateGenre } from '../hooks/use-genre-mutations';
import type { Genre } from '../types/genre.types';

interface GenreFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  genre: Genre | null;
}

function toFormValues(genre: Genre | null): GenreFormValues {
  return genre
    ? {
        code: genre.code,
        name: genre.name,
        description: genre.description ?? '',
        sortOrder: genre.sortOrder,
        isActive: genre.isActive,
      }
    : { code: '', name: '', description: '', sortOrder: 0, isActive: true };
}

/**
 * Modal de creación/edición de géneros literarios (doc 02, módulo agregado
 * por cobertura de backend). Se remonta vía `key` en la página cada vez que
 * se abre, así que `defaultValues` se calcula directo en el render inicial.
 */
export function GenreFormModal({ open, onOpenChange, genre }: GenreFormModalProps) {
  const isEditing = Boolean(genre);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const createMutation = useCreateGenre();
  const updateMutation = useUpdateGenre();
  const saving = createMutation.isPending || updateMutation.isPending;

  const form = useForm<GenreFormValues>({
    resolver: zodResolver(genreSchema),
    defaultValues: toFormValues(genre),
  });

  function onSubmit(values: GenreFormValues) {
    setGeneralError(null);
    const payload = {
      ...values,
      code: values.code.trim().toUpperCase(),
      description: values.description || undefined,
    };

    const mutation = isEditing
      ? updateMutation.mutateAsync({ id: genre!.id, payload })
      : createMutation.mutateAsync(payload);

    mutation
      .then(() => {
        AppFeedback.success(isEditing ? AdminMessages.UpdatedSuccess : AdminMessages.CreatedSuccess);
        onOpenChange(false);
      })
      .catch((error) => setGeneralError(applyServerErrors(error, form.setError)));
  }

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar género' : 'Nuevo género'}
      onSubmit={form.handleSubmit(onSubmit)}
      saving={saving}
      generalError={generalError}
    >
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Código" htmlFor="code" required error={form.formState.errors.code?.message}>
          <Input id="code" placeholder="ADVENTURE" {...form.register('code')} />
        </FormField>
        <FormField label="Orden" htmlFor="sortOrder" error={form.formState.errors.sortOrder?.message}>
          <Input id="sortOrder" type="number" min={0} {...form.register('sortOrder', { valueAsNumber: true })} />
        </FormField>
      </div>

      <FormField label="Nombre" htmlFor="name" required error={form.formState.errors.name?.message}>
        <Input id="name" placeholder="Aventura" {...form.register('name')} />
      </FormField>

      <FormField label="Descripción" htmlFor="description" error={form.formState.errors.description?.message}>
        <Textarea id="description" rows={3} {...form.register('description')} />
      </FormField>

      <Controller
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <Label className="flex w-fit items-center gap-2 font-normal">
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            Género activo
          </Label>
        )}
      />
    </FormModal>
  );
}
