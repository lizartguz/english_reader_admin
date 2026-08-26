import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormModal } from '@/core/ui/forms/FormModal';
import { FormField } from '@/core/ui/forms/FormField';
import { FilterSelect } from '@/core/ui/misc/FilterSelect';
import { AppFeedback } from '@/core/ui/feedback/AppFeedback';
import { applyServerErrors } from '@/core/errors/error-mapper';
import { AdminMessages } from '@/core/config/constants';
import {
  PART_OF_SPEECH_LABELS,
  PART_OF_SPEECH_VALUES,
  wordSchema,
  type WordFormValues,
} from '../schemas/word.schema';
import { useCreateWord, useUpdateWord } from '../hooks/use-words';
import type { PartOfSpeech, WordListItem } from '../types/word.types';

interface WordFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  word: WordListItem | null;
}

const PART_OF_SPEECH_OPTIONS = [
  { value: '', label: 'Sin especificar' },
  ...PART_OF_SPEECH_VALUES.map((value) => ({ value, label: PART_OF_SPEECH_LABELS[value] })),
];

/** Alta y edición de palabras del diccionario (doc 02/10). */
export function WordFormModal({ open, onOpenChange, word }: WordFormModalProps) {
  const isEditing = Boolean(word);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const createMutation = useCreateWord();
  const updateMutation = useUpdateWord();
  const saving = createMutation.isPending || updateMutation.isPending;

  const form = useForm<WordFormValues>({
    resolver: zodResolver(wordSchema),
    defaultValues: {
      word: word?.word ?? '',
      phonetic: word?.phonetic ?? '',
      definitionEn: word?.definitionEn ?? '',
      partOfSpeech: word?.partOfSpeech ?? '',
    },
  });

  function onSubmit(values: WordFormValues) {
    setGeneralError(null);
    const payload = {
      word: values.word.trim(),
      phonetic: values.phonetic || null,
      definitionEn: values.definitionEn || null,
      partOfSpeech: (values.partOfSpeech || null) as PartOfSpeech | null,
    };

    const mutation = isEditing
      ? updateMutation.mutateAsync({ id: word!.id, payload })
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
      title={isEditing ? 'Editar palabra' : 'Nueva palabra'}
      description={isEditing ? undefined : 'Las palabras creadas manualmente nacen como revisadas.'}
      onSubmit={form.handleSubmit(onSubmit)}
      saving={saving}
      generalError={generalError}
    >
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Palabra" htmlFor="word" required error={form.formState.errors.word?.message}>
          <Input id="word" placeholder="beautiful" {...form.register('word')} />
        </FormField>
        <FormField label="Fonética" htmlFor="phonetic" error={form.formState.errors.phonetic?.message}>
          <Input id="phonetic" placeholder="/ˈbjuːtɪfl/" {...form.register('phonetic')} />
        </FormField>
      </div>

      <FormField label="Tipo gramatical" htmlFor="partOfSpeech" error={form.formState.errors.partOfSpeech?.message}>
        <Controller
          control={form.control}
          name="partOfSpeech"
          render={({ field }) => (
            <FilterSelect
              aria-label="Tipo gramatical"
              value={field.value}
              onValueChange={field.onChange}
              options={PART_OF_SPEECH_OPTIONS}
              className="w-full"
            />
          )}
        />
      </FormField>

      <FormField
        label="Definición en inglés"
        htmlFor="definitionEn"
        error={form.formState.errors.definitionEn?.message}
      >
        <Textarea id="definitionEn" rows={4} {...form.register('definitionEn')} />
      </FormField>
    </FormModal>
  );
}
