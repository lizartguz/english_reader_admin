export type ReviewStatus = 'pending' | 'reviewed' | 'rejected';

export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'pronoun'
  | 'preposition'
  | 'conjunction'
  | 'interjection'
  | 'determiner'
  | 'numeral'
  | 'article'
  | 'phrase'
  | 'other';

/** Fila del listado administrativo de palabras. */
export interface WordListItem {
  id: string;
  word: string;
  normalizedWord: string;
  language: string;
  phonetic: string | null;
  definitionEn: string | null;
  partOfSpeech: PartOfSpeech | null;
  source: string | null;
  reviewStatus: ReviewStatus;
  reviewedByUserId: string | null;
  reviewedAt: string | null;
  translationsCount: number;
  savedUsersCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WordTranslation {
  id: string;
  wordEntryId: string;
  targetLanguage: string;
  translation: string;
  meaningContext: string | null;
  source: string | null;
  reviewStatus: ReviewStatus;
  reviewedByUserId: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WordExample {
  id: string;
  exampleText: string;
  source: string | null;
  sortOrder: number;
}

export interface WordPronunciation {
  id: string;
  accent: string | null;
  phonetic: string | null;
  audioUrl: string | null;
  source: string | null;
}

/** Detalle completo de una palabra (`GET /admin/words/:id`). */
export interface WordDetail {
  id: string;
  word: string;
  normalizedWord: string;
  language: string;
  phonetic: string | null;
  definitionEn: string | null;
  partOfSpeech: PartOfSpeech | null;
  source: string | null;
  reviewStatus: ReviewStatus;
  translations: Array<Pick<WordTranslation, 'id' | 'targetLanguage' | 'translation' | 'meaningContext' | 'source' | 'reviewStatus'>>;
  examples: WordExample[];
  pronunciations: WordPronunciation[];
  createdAt: string;
  updatedAt: string;
}

export interface WordFilters {
  search?: string;
  reviewStatus?: ReviewStatus;
  partOfSpeech?: PartOfSpeech;
  page?: number;
  limit?: number;
}

export interface WordPayload {
  word: string;
  phonetic?: string | null;
  definitionEn?: string | null;
  partOfSpeech?: PartOfSpeech | null;
  source?: string | null;
}

export interface TranslationPayload {
  translation: string;
  meaningContext?: string | null;
  source?: string | null;
}
