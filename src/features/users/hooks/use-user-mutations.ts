import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { RoleCode } from '@/core/permissions/roles.enum';
import { usersApi } from '../api/users.api';
import { usersKeys } from './use-users-query';
import type { AssignableUserStatus, CreateUserPayload, UpdateUserPayload } from '../types/user.types';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => usersApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersKeys.all }),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      usersApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersKeys.all }),
  });
}

export function useChangeUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AssignableUserStatus }) =>
      usersApi.changeStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersKeys.all }),
  });
}

export function useAssignUserRoles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, roleCodes }: { id: string; roleCodes: RoleCode[] }) =>
      usersApi.assignRoles(id, roleCodes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersKeys.all }),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersKeys.all }),
  });
}
