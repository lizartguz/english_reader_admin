import { useQuery } from '@tanstack/react-query';
import { permissionsApi } from '../api/permissions.api';

export const permissionsKeys = {
  all: ['permissions'] as const,
};

/** Catálogo completo de permisos, cacheado: cambia muy poco. */
export function usePermissionsQuery() {
  return useQuery({
    queryKey: permissionsKeys.all,
    queryFn: permissionsApi.list,
    staleTime: 5 * 60_000,
  });
}
