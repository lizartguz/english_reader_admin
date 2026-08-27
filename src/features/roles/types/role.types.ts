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
  /** `true` = roles base del sistema, `false` = personalizados. */
  isSystem?: boolean;
  page?: number;
  limit?: number;
}
