import { requestPaginated } from '@/core/api/api-client';
import type { PaginatedResult } from '@/core/api/api-response';
import type { AuditLog, AuditLogFilters } from '../types/audit-log.types';

const BASE_URL = '/admin/audit-logs';

export const auditApi = {
  list: (filters: AuditLogFilters): Promise<PaginatedResult<AuditLog>> =>
    requestPaginated<AuditLog>({ url: BASE_URL, params: filters }),
};
