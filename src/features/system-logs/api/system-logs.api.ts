import { requestPaginated } from '@/core/api/api-client';
import type { PaginatedResult } from '@/core/api/api-response';
import type { SystemLog, SystemLogFilters } from '../types/system-log.types';

const BASE_URL = '/admin/system-logs';

export const systemLogsApi = {
  list: (filters: SystemLogFilters): Promise<PaginatedResult<SystemLog>> =>
    requestPaginated<SystemLog>({ url: BASE_URL, params: filters }),
};
