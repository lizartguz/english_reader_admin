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
