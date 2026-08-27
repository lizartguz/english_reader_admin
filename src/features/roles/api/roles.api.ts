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

  /**
   * Rol individual, siempre recién traído del servidor.
   *
   * El modal de permisos envía el conjunto **completo**, así que partir de la
   * copia cacheada del listado haría que se sobrescribieran en silencio los
   * cambios que otro administrador acabara de guardar.
   */
  detail: (id: string) => request<Role>({ url: `${BASE_URL}/${id}` }),

  updatePermissions: (id: string, permissionCodes: string[]) =>
    request<Role>({ method: 'PATCH', url: `${BASE_URL}/${id}/permissions`, data: { permissionCodes } }),
};
