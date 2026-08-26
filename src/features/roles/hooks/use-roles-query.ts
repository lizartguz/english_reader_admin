import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { rolesApi } from '../api/roles.api';
import type { RoleFilters } from '../types/role.types';

export const rolesKeys = {
  all: ['roles'] as const,
  list: (filters: RoleFilters) => ['roles', 'list', filters] as const,
};

export function useRolesQuery(filters: RoleFilters) {
  return useQuery({
    queryKey: rolesKeys.list(filters),
    queryFn: () => rolesApi.list(filters),
    placeholderData: keepPreviousData,
  });
}
