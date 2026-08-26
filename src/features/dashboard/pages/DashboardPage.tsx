import { useQuery } from '@tanstack/react-query';
import { BookOpen, BookText, Clock, FileEdit, Languages, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/core/ui/layout/PageHeader';
import { CircularLoader } from '@/core/ui/feedback/CircularLoader';
import { EmptyState } from '@/core/ui/feedback/EmptyState';
import { usePermissions } from '@/core/auth/permission-checker';
import { PermissionCode } from '@/core/permissions/permissions.enum';
import { formatDateTime } from '@/core/utils/format-date';
import { dashboardApi } from '../api/dashboard.api';

function StatCard({ label, icon: Icon, query }: { label: string; icon: LucideIcon; query: ReturnType<typeof useQuery<number>> }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 py-2">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" aria-hidden />
        </div>
        <div>
          <div className="text-2xl font-semibold text-foreground">
            {query.isLoading ? <CircularLoader size="sm" /> : (query.data ?? '—')}
          </div>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { hasPermission } = usePermissions();

  const canReadStories = hasPermission(PermissionCode.StoriesRead);
  const canReadWords = hasPermission(PermissionCode.WordsRead);
  const canReadUsers = hasPermission(PermissionCode.UsersRead);
  const canReadTranslations = hasPermission(PermissionCode.TranslationsRead);
  const canReadAudit = hasPermission(PermissionCode.AuditRead);

  const published = useQuery({
    queryKey: ['dashboard', 'stories', 'published'],
    queryFn: dashboardApi.publishedStoriesCount,
    enabled: canReadStories,
  });
  const draft = useQuery({
    queryKey: ['dashboard', 'stories', 'draft'],
    queryFn: dashboardApi.draftStoriesCount,
    enabled: canReadStories,
  });
  const words = useQuery({
    queryKey: ['dashboard', 'words', 'total'],
    queryFn: dashboardApi.dictionaryWordsCount,
    enabled: canReadWords,
  });
  const pendingTranslations = useQuery({
    queryKey: ['dashboard', 'translations', 'pending'],
    queryFn: dashboardApi.pendingTranslationsCount,
    enabled: canReadTranslations,
  });
  const clients = useQuery({
    queryKey: ['dashboard', 'users', 'active-clients'],
    queryFn: dashboardApi.activeClientsCount,
    enabled: canReadUsers,
  });
  const recentAudit = useQuery({
    queryKey: ['dashboard', 'audit', 'recent'],
    queryFn: dashboardApi.recentAuditLogs,
    enabled: canReadAudit,
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Resumen operativo de English Reader." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {canReadStories && <StatCard label="Historias publicadas" icon={BookOpen} query={published} />}
        {canReadStories && <StatCard label="Historias en borrador" icon={FileEdit} query={draft} />}
        {canReadWords && <StatCard label="Palabras en diccionario" icon={BookText} query={words} />}
        {canReadTranslations && (
          <StatCard label="Traducciones por revisar" icon={Languages} query={pendingTranslations} />
        )}
        {canReadUsers && <StatCard label="Clientes activos" icon={Users} query={clients} />}
      </div>

      {canReadAudit && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Últimos eventos administrativos</CardTitle>
          </CardHeader>
          <CardContent>
            {recentAudit.isLoading ? (
              <CircularLoader />
            ) : !recentAudit.data || recentAudit.data.length === 0 ? (
              <EmptyState title="Sin eventos recientes" description="Todavía no hay actividad administrativa registrada." icon={Clock} />
            ) : (
              <ul className="divide-y">
                {recentAudit.data.map((log) => (
                  <li key={log.id} className="flex items-center justify-between gap-4 py-2.5 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{log.summary}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {log.actor?.fullName ?? 'Sistema'} · {log.action}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{formatDateTime(log.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
