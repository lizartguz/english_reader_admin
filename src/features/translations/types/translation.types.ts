import type { ReviewStatus } from '@/features/dictionary/types/word.types';

export type { ReviewStatus };

/** Fila del listado global de traducciones (`GET /admin/translations`). */
export interface TranslationListItem {
  id: string;
  wordEntryId: string;
  targetLanguage: string;
  translation: string;
  meaningContext: string | null;
  source: string | null;
  reviewStatus: ReviewStatus;
  reviewedBy: { id: string; fullName: string } | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  word: { id: string; word: string };
}

export interface TranslationFilters {
  /** Búsqueda por la palabra en inglés asociada. */
  word?: string;
  targetLanguage?: string;
  reviewStatus?: ReviewStatus;
  source?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface UpdateTranslationPayload {
  translation?: string;
  meaningContext?: string | null;
  source?: string | null;
  targetLanguage?: string;
}
