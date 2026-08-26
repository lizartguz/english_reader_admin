import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/core/ui/layout/PageHeader';
import { FilterBar } from '@/core/ui/misc/FilterBar';
import { DataTable } from '@/core/ui/tables/DataTable';
import { TablePagination } from '@/core/ui/tables/TablePagination';
import { EmptyState } from '@/core/ui/feedback/EmptyState';
import { DEFAULT_PAGE_SIZE } from '@/core/config/constants';
import { useAuditLogsQuery } from '../hooks/use-audit-logs-query';
import { getAuditColumns } from '../components/audit-columns';
import { AuditDetailDialog } from '../components/AuditDetailDialog';
import type { AuditLog, AuditLogFilters } from '../types/audit-log.types';

export function AuditPage() {
  const [action, setAction] = useState('');
  const [entityType, setEntityType] = useState('');
  const [page, setPage] = useState(1);
  const [detailLog, setDetailLog] = useState<AuditLog | null>(null);

  const filters: AuditLogFilters = useMemo(
    () => ({
      action: action || undefined,
      entityType: entityType || undefined,
      page,
      limit: DEFAULT_PAGE_SIZE,
    }),
    [action, entityType, page],
  );

  const query = useAuditLogsQuery(filters);
  const hasActiveFilters = Boolean(action) || Boolean(entityType);

  function clearFilters() {
    setAction('');
    setEntityType('');
    setPage(1);
  }

  const columns = getAuditColumns({ onViewDetail: setDetailLog });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Auditoría"
        description="Acciones administrativas sensibles. Solo lectura: sin edición ni eliminación."
      />

      <FilterBar onClear={clearFilters} hasActiveFilters={hasActiveFilters}>
        <Input
          placeholder="Acción (ej. story.created)"
          className="w-56"
          value={action}
          onChange={(event) => {
            setPage(1);
            setAction(event.target.value);
          }}
        />
        <Input
          placeholder="Entidad (ej. Story)"
          className="w-48"
          value={entityType}
          onChange={(event) => {
            setPage(1);
            setEntityType(event.target.value);
          }}
        />
      </FilterBar>

      <DataTable
        columns={columns}
        data={query.data?.items ?? []}
        isLoading={query.isLoading}
        isError={query.isError}
        error={query.error}
        onRetry={() => query.refetch()}
        getRowId={(row) => row.id}
        emptyState={<EmptyState title="Sin eventos" description="No hay eventos de auditoría con los filtros actuales." />}
      />

      <TablePagination meta={query.data?.meta} onPageChange={setPage} />

      <AuditDetailDialog log={detailLog} onOpenChange={(open) => !open && setDetailLog(null)} />
    </div>
  );
}
