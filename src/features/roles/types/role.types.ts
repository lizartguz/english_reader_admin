export interface Role {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RoleFilters {
  search?: string;
  page?: number;
  limit?: number;
}
