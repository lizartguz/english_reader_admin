import { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FormModal } from '@/core/ui/forms/FormModal';
import { FormField } from '@/core/ui/forms/FormField';
import { FilterSelect } from '@/core/ui/misc/FilterSelect';
import { AppFeedback } from '@/core/ui/feedback/AppFeedback';
import { applyServerErrors } from '@/core/errors/error-mapper';
import { AdminMessages, TARGET_LANGUAGES } from '@/core/config/constants';
import { NestedSection } from './NestedSection';
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

const LANGUAGE_OPTIONS = TARGET_LANGUAGES.map((lang) => ({ value: lang.code, label: lang.label }));

/**
 * Alta y edición de palabras del diccionario (doc 02/10).
 *
 * Al crear se pueden cargar traducciones, ejemplos y pronunciaciones en el
 * mismo envío: así se precarga el diccionario desde administración y la app
 * resuelve esas palabras desde la base local, sin consultar proveedores
 * externos. Al editar solo se tocan los datos base, porque las colecciones
 * tienen sus propios endpoints en la API.
 */
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
      translations: [],
      examples: [],
      pronunciations: [],
    },
  });

  const traducciones = useFieldArray({ control: form.control, name: 'translations' });
  const ejemplos = useFieldArray({ control: form.control, name: 'examples' });
  const pronunciaciones = useFieldArray({ control: form.control, name: 'pronunciations' });

  function onSubmit(values: WordFormValues) {
    setGeneralError(null);

    const base = {
      word: values.word.trim(),
      phonetic: values.phonetic || null,
      definitionEn: values.definitionEn || null,
      partOfSpeech: (values.partOfSpeech || null) as PartOfSpeech | null,
    };

    const mutation = isEditing
      ? updateMutation.mutateAsync({ id: word!.id, payload: base })
      : createMutation.mutateAsync({
          ...base,
          // Las colecciones vacías se omiten para no enviar arreglos inútiles.
          ...(values.translations.length
            ? {
                translations: values.translations.map((item) => ({
                  targetLanguage: item.targetLanguage,
                  translation: item.translation,
                  meaningContext: item.meaningContext || null,
                })),
              }
            : {}),
          ...(values.examples.length
            ? { examples: values.examples.map((item, index) => ({ ...item, sortOrder: index })) }
            : {}),
          ...(values.pronunciations.length
            ? {
                pronunciations: values.pronunciations.map((item) => ({
                  accent: item.accent || null,
                  phonetic: item.phonetic || null,
                  audioUrl: item.audioUrl || null,
                })),
              }
            : {}),
        });

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
      title={isEditing ? 'Editar palabra' : 'Nueva palabra'}
      description={
        isEditing
          ? undefined
          : 'Se registra como revisada y evita que la app consulte servicios externos cuando un lector la toque.'
      }
      onSubmit={form.handleSubmit(onSubmit)}
      saving={saving}
      generalError={generalError}
      className="sm:max-w-2xl"
      saveLabel={isEditing ? 'Guardar' : 'Guardar palabra'}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField label="Palabra" htmlFor="word" required error={form.formState.errors.word?.message}>
          <Input id="word" placeholder="hello" {...form.register('word')} />
        </FormField>
        <FormField label="Fonética" htmlFor="phonetic" error={form.formState.errors.phonetic?.message}>
          <Input id="phonetic" placeholder="/həˈloʊ/" {...form.register('phonetic')} />
        </FormField>
        <FormField
          label="Tipo gramatical"
          htmlFor="partOfSpeech"
          error={form.formState.errors.partOfSpeech?.message}
        >
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
      </div>

      <FormField
        label="Definición en inglés"
        htmlFor="definitionEn"
        error={form.formState.errors.definitionEn?.message}
      >
        <Textarea id="definitionEn" rows={3} {...form.register('definitionEn')} />
      </FormField>

      {/* Las colecciones anidadas solo existen en el alta: al editar, cada una
          se gestiona con sus propios endpoints. */}
      {!isEditing && (
        <>
          <NestedSection
            title="Traducciones"
            count={traducciones.fields.length}
            addLabel="Agregar traducción"
            defaultOpen
            onAdd={() => traducciones.append({ targetLanguage: 'es', translation: '', meaningContext: '' })}
          >
            {traducciones.fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <div className="w-28 shrink-0 space-y-1">
                  <Controller
                    control={form.control}
                    name={`translations.${index}.targetLanguage`}
                    render={({ field: langField }) => (
                      <FilterSelect
                        aria-label={`Idioma de la traducción ${index + 1}`}
                        value={langField.value}
                        onValueChange={langField.onChange}
                        options={LANGUAGE_OPTIONS}
                        className="w-full"
                      />
                    )}
                  />
                  {/* La API valida el idioma destino y devuelve el error en esta
                      ruta; sin este bloque el mensaje se aplicaba al formulario
                      pero no se mostraba en ningún lado. */}
                  {form.formState.errors.translations?.[index]?.targetLanguage && (
                    <p className="text-xs text-destructive" role="alert">
                      {form.formState.errors.translations[index]?.targetLanguage?.message}
                    </p>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <Input
                    aria-label={`Traducción ${index + 1}`}
                    placeholder="hola"
                    {...form.register(`translations.${index}.translation`)}
                  />
                  {form.formState.errors.translations?.[index]?.translation && (
                    <p className="text-xs text-destructive" role="alert">
                      {form.formState.errors.translations[index]?.translation?.message}
                    </p>
                  )}
                </div>
                <Input
                  aria-label={`Contexto de la traducción ${index + 1}`}
                  placeholder="Contexto (opcional)"
                  className="flex-1"
                  {...form.register(`translations.${index}.meaningContext`)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => traducciones.remove(index)}
                >
                  <Trash2 className="text-destructive" />
                  <span className="sr-only">Quitar traducción {index + 1}</span>
                </Button>
              </div>
            ))}
          </NestedSection>

          <NestedSection
            title="Ejemplos de uso"
            count={ejemplos.fields.length}
            addLabel="Agregar ejemplo"
            onAdd={() => ejemplos.append({ exampleText: '' })}
          >
            {ejemplos.fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <div className="flex-1 space-y-1">
                  <Input
                    aria-label={`Ejemplo ${index + 1}`}
                    placeholder="Hello, how are you today?"
                    {...form.register(`examples.${index}.exampleText`)}
                  />
                  {form.formState.errors.examples?.[index]?.exampleText && (
                    <p className="text-xs text-destructive" role="alert">
                      {form.formState.errors.examples[index]?.exampleText?.message}
                    </p>
                  )}
                </div>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => ejemplos.remove(index)}>
                  <Trash2 className="text-destructive" />
                  <span className="sr-only">Quitar ejemplo {index + 1}</span>
                </Button>
              </div>
            ))}
          </NestedSection>

          <NestedSection
            title="Pronunciaciones"
            count={pronunciaciones.fields.length}
            addLabel="Agregar pronunciación"
            onAdd={() => pronunciaciones.append({ accent: '', phonetic: '', audioUrl: '' })}
          >
            {pronunciaciones.fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <Input
                  aria-label={`Acento ${index + 1}`}
                  placeholder="en-US"
                  className="w-24 shrink-0"
                  {...form.register(`pronunciations.${index}.accent`)}
                />
                <Input
                  aria-label={`Fonética ${index + 1}`}
                  placeholder="/həˈloʊ/"
                  className="flex-1"
                  {...form.register(`pronunciations.${index}.phonetic`)}
                />
                <Input
                  aria-label={`Audio ${index + 1}`}
                  placeholder="URL de audio (opcional)"
                  className="flex-1"
                  {...form.register(`pronunciations.${index}.audioUrl`)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => pronunciaciones.remove(index)}
                >
                  <Trash2 className="text-destructive" />
                  <span className="sr-only">Quitar pronunciación {index + 1}</span>
                </Button>
              </div>
            ))}
          </NestedSection>
        </>
      )}
    </FormModal>
  );
}
