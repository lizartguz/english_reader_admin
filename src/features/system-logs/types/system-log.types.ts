export type SystemLogLevel = 'info' | 'warning' | 'error' | 'critical';

export interface SystemLog {
  id: string;
  level: SystemLogLevel;
  source: string;
  message: string;
  exceptionName: string | null;
  errorCode: string | null;
  requestMethod: string | null;
  requestPath: string | null;
  actorUserId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: unknown;
  createdAt: string;
}

export interface SystemLogFilters {
  level?: SystemLogLevel;
  source?: string;
  errorCode?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}
