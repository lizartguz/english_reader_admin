import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';
import type { UserFilters } from '../types/user.types';

export const usersKeys = {
  all: ['users'] as const,
  list: (filters: UserFilters) => ['users', 'list', filters] as const,
};

export function useUsersQuery(filters: UserFilters) {
  return useQuery({
    queryKey: usersKeys.list(filters),
    queryFn: () => usersApi.list(filters),
    placeholderData: keepPreviousData,
  });
}
