import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { FilterSelect } from '@/core/ui/misc/FilterSelect';
import { DateRangeFilter } from '@/core/ui/misc/DateRangeFilter';
import { toIsoRange } from '@/core/utils/date-range';
import { PageHeader } from '@/core/ui/layout/PageHeader';
import { FilterBar } from '@/core/ui/misc/FilterBar';
import { DataTable } from '@/core/ui/tables/DataTable';
import { TablePagination } from '@/core/ui/tables/TablePagination';
import { EmptyState } from '@/core/ui/feedback/EmptyState';
import { DEFAULT_PAGE_SIZE } from '@/core/config/constants';
import { useDebouncedValue } from '@/core/hooks/use-debounced-value';
import { useSystemLogsQuery } from '../hooks/use-system-logs-query';
import { getSystemLogColumns } from '../components/system-logs-columns';
import { SystemLogDetailDialog } from '../components/SystemLogDetailDialog';
import type { SystemLog, SystemLogFilters, SystemLogLevel } from '../types/system-log.types';

type LevelFilter = 'all' | SystemLogLevel;

export function SystemLogsPage() {
  const [level, setLevel] = useState<LevelFilter>('all');
  const [source, setSource] = useState('');
  const sourceDiferido = useDebouncedValue(source);
  const [errorCode, setErrorCode] = useState('');
  const errorCodeDiferido = useDebouncedValue(errorCode);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const [detailLog, setDetailLog] = useState<SystemLog | null>(null);

  const filters: SystemLogFilters = useMemo(
    () => ({
      level: level === 'all' ? undefined : level,
      source: sourceDiferido || undefined,
      errorCode: errorCodeDiferido || undefined,
      ...toIsoRange(from, to),
      page,
      limit: DEFAULT_PAGE_SIZE,
    }),
    [level, sourceDiferido, errorCodeDiferido, from, to, page],
  );

  const query = useSystemLogsQuery(filters);
  const hasActiveFilters =
    level !== 'all' || Boolean(source) || Boolean(errorCode) || Boolean(from) || Boolean(to);

  function clearFilters() {
    setLevel('all');
    setSource('');
    setErrorCode('');
    setFrom('');
    setTo('');
    setPage(1);
  }

  const columns = getSystemLogColumns({ onViewDetail: setDetailLog });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Logs del sistema"
        description="Registros técnicos de errores y fallos operativos. Solo lectura, visible únicamente para SUPER_ADMIN."
      />

      <FilterBar onClear={clearFilters} hasActiveFilters={hasActiveFilters}>
        <FilterSelect
          aria-label="Filtrar por nivel"
          value={level}
          onValueChange={(value) => {
            setPage(1);
            setLevel(value as LevelFilter);
          }}
          options={[
            { value: 'all', label: 'Todos los niveles' },
            { value: 'info', label: 'Info' },
            { value: 'warning', label: 'Advertencia' },
            { value: 'error', label: 'Error' },
            { value: 'critical', label: 'Crítico' },
          ]}
        />
        <Input
          placeholder="Fuente (ej. auth, http)"
          className="w-52"
          value={source}
          onChange={(event) => {
            setPage(1);
            setSource(event.target.value);
          }}
        />
        <Input
          placeholder="Código de error"
          className="w-48"
          aria-label="Filtrar por código de error"
          value={errorCode}
          onChange={(event) => {
            setPage(1);
            setErrorCode(event.target.value);
          }}
        />
        <DateRangeFilter
          idPrefix="systemLog"
          from={from}
          to={to}
          onFromChange={(value) => {
            setPage(1);
            setFrom(value);
          }}
          onToChange={(value) => {
            setPage(1);
            setTo(value);
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
        emptyState={<EmptyState title="Sin registros" description="No hay registros técnicos con los filtros actuales." />}
      />

      <TablePagination meta={query.data?.meta} onPageChange={setPage} />

      <SystemLogDetailDialog log={detailLog} onOpenChange={(open) => !open && setDetailLog(null)} />
    </div>
  );
}
