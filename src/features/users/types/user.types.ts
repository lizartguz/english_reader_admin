import type { RoleCode } from '@/core/permissions/roles.enum';

export type UserStatus = 'active' | 'inactive' | 'blocked' | 'pending_verification';

/** Estados que un administrador puede asignar manualmente (doc: `pending_verification` queda fuera). */
export type AssignableUserStatus = Exclude<UserStatus, 'pending_verification'>;

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string | null;
  status: UserStatus;
  roles: string[];
  permissions: string[];
  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserFilters {
  search?: string;
  status?: UserStatus;
  /** Uno o varios roles: la API acepta el parámetro repetido. */
  roleCode?: RoleCode[];
  page?: number;
  limit?: number;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  roleCodes: RoleCode[];
}

export interface UpdateUserPayload {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}
