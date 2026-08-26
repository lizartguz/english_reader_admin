export interface Genre {
  id: string;
  code: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GenreFilters {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface GenrePayload {
  code: string;
  name: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}
