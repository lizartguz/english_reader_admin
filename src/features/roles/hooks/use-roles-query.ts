import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { rolesApi } from '../api/roles.api';
import type { RoleFilters } from '../types/role.types';

export const rolesKeys = {
  all: ['roles'] as const,
  list: (filters: RoleFilters) => ['roles', 'list', filters] as const,
  detail: (id: string) => ['roles', 'detail', id] as const,
};

export function useRolesQuery(filters: RoleFilters) {
  return useQuery({
    queryKey: rolesKeys.list(filters),
    queryFn: () => rolesApi.list(filters),
    placeholderData: keepPreviousData,
  });
}

/**
 * Rol individual para el modal de permisos.
 *
 * `staleTime: 0` es deliberado: se pide de nuevo cada vez que se abre el modal
 * para no partir de una copia vieja del listado y pisar cambios ajenos.
 */
export function useRoleDetailQuery(roleId: string | null) {
  return useQuery({
    queryKey: rolesKeys.detail(roleId ?? ''),
    queryFn: () => rolesApi.detail(roleId!),
    enabled: Boolean(roleId),
    staleTime: 0,
  });
}
