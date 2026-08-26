export type SavedWordStatus = 'saved' | 'learning' | 'learned' | 'archived';

export interface VocabularyWordSummary {
  word: string;
  reviewStatus: string;
}

export interface VocabularyStorySummary {
  id: string;
  title: string;
  slug: string;
}

export interface VocabularyUserSummary {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface VocabularyEntry {
  id: string;
  status: SavedWordStatus;
  notes: string | null;
  savedAt: string;
  lastReviewedAt: string | null;
  word: VocabularyWordSummary;
  story: VocabularyStorySummary | null;
  user: VocabularyUserSummary;
  createdAt: string;
  updatedAt: string;
}

export interface VocabularyFilters {
  status?: SavedWordStatus;
  page?: number;
  limit?: number;
}
