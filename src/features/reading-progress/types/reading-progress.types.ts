export interface ReadingProgressUserSummary {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface ReadingProgressStorySummary {
  id: string;
  title: string;
  slug: string;
}

export interface ReadingProgressEntry {
  id: string;
  userId: string;
  storyId: string;
  progressPercent: number;
  lastPosition: string | null;
  completedAt: string | null;
  lastReadAt: string | null;
  user: ReadingProgressUserSummary;
  story: ReadingProgressStorySummary;
  createdAt: string;
  updatedAt: string;
}

export interface ReadingProgressFilters {
  completed?: boolean;
  page?: number;
  limit?: number;
}
