import { z } from 'zod';

export const PART_OF_SPEECH_VALUES = [
  'noun',
  'verb',
  'adjective',
  'adverb',
  'pronoun',
  'preposition',
  'conjunction',
  'interjection',
  'determiner',
  'numeral',
  'article',
  'phrase',
  'other',
] as const;

/** Etiquetas en español para el tipo gramatical. */
export const PART_OF_SPEECH_LABELS: Record<(typeof PART_OF_SPEECH_VALUES)[number], string> = {
  noun: 'Sustantivo',
  verb: 'Verbo',
  adjective: 'Adjetivo',
  adverb: 'Adverbio',
  pronoun: 'Pronombre',
  preposition: 'Preposición',
  conjunction: 'Conjunción',
  interjection: 'Interjección',
  determiner: 'Determinante',
  numeral: 'Numeral',
  article: 'Artículo',
  phrase: 'Frase',
  other: 'Otro',
};

/** Límite por arreglo anidado que impone `CreateWordDto` en la API. */
export const MAX_NESTED_ITEMS = 10;

export const wordSchema = z.object({
  word: z
    .string()
    .min(1, 'La palabra es obligatoria.')
    .max(150, 'La palabra no puede superar 150 caracteres.'),
  phonetic: z.string().max(150, 'La fonética no puede superar 150 caracteres.').optional().or(z.literal('')),
  definitionEn: z
    .string()
    .max(10000, 'La definición no puede superar 10000 caracteres.')
    .optional()
    .or(z.literal('')),
  // '' representa "sin especificar"; se convierte a null antes de enviar.
  partOfSpeech: z.enum([...PART_OF_SPEECH_VALUES, '']),

  // Anidados: solo se envían al crear. La API no los acepta al actualizar, que
  // gestiona cada colección con sus propios endpoints.
  translations: z
    .array(
      z.object({
        targetLanguage: z.string().min(1),
        translation: z
          .string()
          .min(1, 'La traducción es obligatoria.')
          .max(255, 'La traducción no puede superar 255 caracteres.'),
        meaningContext: z
          .string()
          .max(2000, 'El contexto no puede superar 2000 caracteres.')
          .optional()
          .or(z.literal('')),
      }),
    )
    .max(MAX_NESTED_ITEMS, `No se pueden enviar más de ${MAX_NESTED_ITEMS} traducciones.`),

  examples: z
    .array(
      z.object({
        exampleText: z
          .string()
          .min(1, 'El ejemplo no puede estar vacío.')
          .max(2000, 'El ejemplo no puede superar 2000 caracteres.'),
      }),
    )
    .max(MAX_NESTED_ITEMS, `No se pueden enviar más de ${MAX_NESTED_ITEMS} ejemplos.`),

  pronunciations: z
    .array(
      z.object({
        accent: z.string().max(10, 'El acento no puede superar 10 caracteres.').optional().or(z.literal('')),
        phonetic: z.string().max(150, 'La fonética no puede superar 150 caracteres.').optional().or(z.literal('')),
        audioUrl: z.string().max(1000, 'La URL no puede superar 1000 caracteres.').optional().or(z.literal('')),
      }),
    )
    .max(MAX_NESTED_ITEMS, `No se pueden enviar más de ${MAX_NESTED_ITEMS} pronunciaciones.`),
});

export type WordFormValues = z.infer<typeof wordSchema>;

export const translationSchema = z.object({
  translation: z
    .string()
    .min(1, 'La traducción es obligatoria.')
    .max(255, 'La traducción no puede superar 255 caracteres.'),
  meaningContext: z
    .string()
    .max(2000, 'El contexto no puede superar 2000 caracteres.')
    .optional()
    .or(z.literal('')),
});

export type TranslationFormValues = z.infer<typeof translationSchema>;
