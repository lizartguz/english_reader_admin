import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesApi } from '../api/roles.api';
import { rolesKeys } from './use-roles-query';

export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, permissionCodes }: { id: string; permissionCodes: string[] }) =>
      rolesApi.updatePermissions(id, permissionCodes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: rolesKeys.all }),
  });
}
