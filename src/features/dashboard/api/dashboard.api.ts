import { requestPaginated } from '@/core/api/api-client';

export interface AuditLogItem {
  id: string;
  actor: { id: string; email: string; fullName: string } | null;
  action: string;
  entityType: string;
  entityId: string | null;
  summary: string;
  createdAt: string;
}

/**
 * No existe un endpoint de estadísticas en el backend (ver plan de
 * arquitectura). Los contadores se derivan de `meta.pagination.total` de los
 * propios listados, pidiendo `limit=1` para no traer datos de más.
 */
export const dashboardApi = {
  publishedStoriesCount: () =>
    requestPaginated<unknown>({ url: '/admin/stories', params: { status: 'published', limit: 1 } }).then(
      (result) => result.meta.total,
    ),

  draftStoriesCount: () =>
    requestPaginated<unknown>({ url: '/admin/stories', params: { status: 'draft', limit: 1 } }).then(
      (result) => result.meta.total,
    ),

  dictionaryWordsCount: () =>
    requestPaginated<unknown>({ url: '/admin/words', params: { limit: 1 } }).then((result) => result.meta.total),

  pendingTranslationsCount: () =>
    requestPaginated<unknown>({
      url: '/admin/translations',
      params: { reviewStatus: 'pending', limit: 1 },
    }).then((result) => result.meta.total),

  activeClientsCount: () =>
    requestPaginated<unknown>({
      url: '/admin/users',
      params: { roleCode: 'CLIENT', status: 'active', limit: 1 },
    }).then((result) => result.meta.total),

  recentAuditLogs: () =>
    requestPaginated<AuditLogItem>({ url: '/admin/audit-logs', params: { limit: 5 } }).then(
      (result) => result.items,
    ),
};
