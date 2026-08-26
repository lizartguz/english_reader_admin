export interface ReadingLevel {
  id: string;
  code: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReadingLevelFilters {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface ReadingLevelPayload {
  code: string;
  name: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}
