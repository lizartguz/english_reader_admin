import { request, requestPaginated } from '@/core/api/api-client';
import type { PaginatedResult } from '@/core/api/api-response';
import type { RoleCode } from '@/core/permissions/roles.enum';
import type {
  AdminUser,
  AssignableUserStatus,
  CreateUserPayload,
  UpdateUserPayload,
  UserFilters,
} from '../types/user.types';

const BASE_URL = '/admin/users';

export const usersApi = {
  list: (filters: UserFilters): Promise<PaginatedResult<AdminUser>> =>
    requestPaginated<AdminUser>({
      url: BASE_URL,
      params: filters,
      // `roleCode` puede llevar varios valores; se repite el parámetro en vez
      // de enviarlo como `roleCode[]`, que es lo que espera la API.
      paramsSerializer: { indexes: null },
    }),

  create: (payload: CreateUserPayload) =>
    request<AdminUser>({ method: 'POST', url: BASE_URL, data: payload }),

  update: (id: string, payload: UpdateUserPayload) =>
    request<AdminUser>({ method: 'PATCH', url: `${BASE_URL}/${id}`, data: payload }),

  changeStatus: (id: string, status: AssignableUserStatus) =>
    request<AdminUser>({ method: 'PATCH', url: `${BASE_URL}/${id}/status`, data: { status } }),

  assignRoles: (id: string, roleCodes: RoleCode[]) =>
    request<AdminUser>({ method: 'PATCH', url: `${BASE_URL}/${id}/roles`, data: { roleCodes } }),

  remove: (id: string) => request<null>({ method: 'DELETE', url: `${BASE_URL}/${id}` }),
};
