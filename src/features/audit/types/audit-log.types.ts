export interface AuditLogActor {
  id: string;
  email: string;
  fullName: string;
}

export interface AuditLog {
  id: string;
  actor: AuditLogActor | null;
  action: string;
  entityType: string;
  entityId: string | null;
  summary: string;
  metadata: unknown;
  ipAddress: string | null;
  createdAt: string;
}

export interface AuditLogFilters {
  actorUserId?: string;
  action?: string;
  entityType?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}
