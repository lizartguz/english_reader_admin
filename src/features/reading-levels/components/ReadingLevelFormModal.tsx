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
import { readingLevelSchema, type ReadingLevelFormValues } from '../schemas/reading-level.schema';
import { useCreateReadingLevel, useUpdateReadingLevel } from '../hooks/use-reading-level-mutations';
import type { ReadingLevel } from '../types/reading-level.types';

interface ReadingLevelFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  readingLevel: ReadingLevel | null;
}

function toFormValues(readingLevel: ReadingLevel | null): ReadingLevelFormValues {
  return readingLevel
    ? {
        code: readingLevel.code,
        name: readingLevel.name,
        description: readingLevel.description ?? '',
        sortOrder: readingLevel.sortOrder,
        isActive: readingLevel.isActive,
      }
    : { code: '', name: '', description: '', sortOrder: 0, isActive: true };
}

/**
 * Modal de creación/edición de niveles de lectura (doc 02/10). El componente
 * se vuelve a montar (vía `key` en la página) cada vez que se abre, así que
 * `defaultValues` se calcula directamente en el render inicial sin `useEffect`.
 */
export function ReadingLevelFormModal({ open, onOpenChange, readingLevel }: ReadingLevelFormModalProps) {
  const isEditing = Boolean(readingLevel);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const createMutation = useCreateReadingLevel();
  const updateMutation = useUpdateReadingLevel();
  const saving = createMutation.isPending || updateMutation.isPending;

  const form = useForm<ReadingLevelFormValues>({
    resolver: zodResolver(readingLevelSchema),
    defaultValues: toFormValues(readingLevel),
  });

  function onSubmit(values: ReadingLevelFormValues) {
    setGeneralError(null);
    const payload = {
      ...values,
      code: values.code.trim().toUpperCase(),
      description: values.description || undefined,
    };

    const mutation = isEditing
      ? updateMutation.mutateAsync({ id: readingLevel!.id, payload })
      : createMutation.mutateAsync(payload);

    mutation
      .then(() => {
        AppFeedback.success(isEditing ? AdminMessages.UpdatedSuccess : AdminMessages.CreatedSuccess);
        onOpenChange(false);
      })
      .catch((error) => setGeneralError(applyServerErrors(error, form)));
  }

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar nivel de lectura' : 'Nuevo nivel de lectura'}
      onSubmit={form.handleSubmit(onSubmit)}
      saving={saving}
      generalError={generalError}
    >
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Código" htmlFor="code" required error={form.formState.errors.code?.message}>
          <Input id="code" placeholder="A1" {...form.register('code')} />
        </FormField>
        <FormField label="Orden" htmlFor="sortOrder" error={form.formState.errors.sortOrder?.message}>
          <Input id="sortOrder" type="number" min={0} {...form.register('sortOrder', { valueAsNumber: true })} />
        </FormField>
      </div>

      <FormField label="Nombre" htmlFor="name" required error={form.formState.errors.name?.message}>
        <Input id="name" placeholder="Principiante" {...form.register('name')} />
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
            Nivel activo
          </Label>
        )}
      />
    </FormModal>
  );
}
