import { request, requestPaginated } from '@/core/api/api-client';
import type { PaginatedResult } from '@/core/api/api-response';
import type { Role, RoleFilters } from '../types/role.types';

const BASE_URL = '/admin/roles';

/**
 * Los roles se administran solo en su asignación de permisos desde el panel:
 * no hay creación, edición de nombre ni eliminación por UI (se gestionan en
 * código/base de datos directamente, según decisión del equipo).
 */
export const rolesApi = {
  list: (filters: RoleFilters): Promise<PaginatedResult<Role>> =>
    requestPaginated<Role>({ url: BASE_URL, params: filters }),

  updatePermissions: (id: string, permissionCodes: string[]) =>
    request<Role>({ method: 'PATCH', url: `${BASE_URL}/${id}/permissions`, data: { permissionCodes } }),
};
