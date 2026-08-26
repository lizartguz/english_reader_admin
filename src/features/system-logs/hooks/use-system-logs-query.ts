import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { systemLogsApi } from '../api/system-logs.api';
import type { SystemLogFilters } from '../types/system-log.types';

export const systemLogsKeys = {
  all: ['system-logs'] as const,
  list: (filters: SystemLogFilters) => ['system-logs', 'list', filters] as const,
};

export function useSystemLogsQuery(filters: SystemLogFilters) {
  return useQuery({
    queryKey: systemLogsKeys.list(filters),
    queryFn: () => systemLogsApi.list(filters),
    placeholderData: keepPreviousData,
  });
}
