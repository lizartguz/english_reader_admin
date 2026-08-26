import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { auditApi } from '../api/audit.api';
import type { AuditLogFilters } from '../types/audit-log.types';

export const auditKeys = {
  all: ['audit-logs'] as const,
  list: (filters: AuditLogFilters) => ['audit-logs', 'list', filters] as const,
};

export function useAuditLogsQuery(filters: AuditLogFilters) {
  return useQuery({
    queryKey: auditKeys.list(filters),
    queryFn: () => auditApi.list(filters),
    placeholderData: keepPreviousData,
  });
}
