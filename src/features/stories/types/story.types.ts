export type StoryStatus = 'draft' | 'published' | 'archived';
export type StoryAssetType = 'cover_image' | 'audio' | 'attachment';
export type FileAccessScope = 'private' | 'public';

export interface StoryRef {
  id: string;
  code: string;
  name: string;
}

export interface StoryAsset {
  id: string;
  type: StoryAssetType;
  originalFileName: string | null;
  mimeType: string;
  fileSizeBytes: number;
  accessScope: FileAccessScope;
  metadata: unknown;
  sortOrder: number;
  downloadUrl: string;
}

export interface StoryListItem {
  id: string;
  title: string;
  slug: string;
  author: string | null;
  summary: string | null;
  status: StoryStatus;
  estimatedReadingMinutes: number | null;
  sortOrder: number;
  publishedAt: string | null;
  readingLevel: StoryRef;
  genres: StoryRef[];
  createdAt: string;
  updatedAt: string;
}

export interface StoryDetail extends StoryListItem {
  content: string;
  assets: StoryAsset[];
}

export interface StoryFilters {
  search?: string;
  status?: StoryStatus;
  readingLevelId?: string;
  genreId?: string;
  /** Rango de publicación (doc 02/10), en formato ISO. */
  publishedFrom?: string;
  publishedTo?: string;
  page?: number;
  limit?: number;
  /** Campos aceptados por la API: createdAt, updatedAt, publishedAt, title, sortOrder. */
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface CreateStoryPayload {
  title: string;
  readingLevelId: string;
  author?: string;
  summary?: string;
  content: string;
  estimatedReadingMinutes?: number;
  genreIds?: string[];
}

export type UpdateStoryPayload = Partial<CreateStoryPayload>;
