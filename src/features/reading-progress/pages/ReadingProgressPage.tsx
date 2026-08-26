import { useMemo, useState } from 'react';
import { FilterSelect } from '@/core/ui/misc/FilterSelect';
import { PageHeader } from '@/core/ui/layout/PageHeader';
import { FilterBar } from '@/core/ui/misc/FilterBar';
import { DataTable } from '@/core/ui/tables/DataTable';
import { TablePagination } from '@/core/ui/tables/TablePagination';
import { EmptyState } from '@/core/ui/feedback/EmptyState';
import { DEFAULT_PAGE_SIZE } from '@/core/config/constants';
import { useReadingProgressQuery } from '../hooks/use-reading-progress-query';
import { getReadingProgressColumns } from '../components/reading-progress-columns';
import type { ReadingProgressFilters } from '../types/reading-progress.types';

type CompletedFilter = 'all' | 'completed' | 'in-progress';

export function ReadingProgressPage() {
  const [completed, setCompleted] = useState<CompletedFilter>('all');
  const [page, setPage] = useState(1);

  const filters: ReadingProgressFilters = useMemo(
    () => ({
      completed: completed === 'all' ? undefined : completed === 'completed',
      page,
      limit: DEFAULT_PAGE_SIZE,
    }),
    [completed, page],
  );

  const query = useReadingProgressQuery(filters);
  const hasActiveFilters = completed !== 'all';

  function clearFilters() {
    setCompleted('all');
    setPage(1);
  }

  const columns = getReadingProgressColumns();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Progreso de lectura"
        description="Avance de los usuarios cliente en cada historia. Solo lectura."
      />

      <FilterBar onClear={clearFilters} hasActiveFilters={hasActiveFilters}>
        <FilterSelect
          aria-label="Filtrar por estado"
          value={completed}
          onValueChange={(value) => {
            setPage(1);
            setCompleted(value as CompletedFilter);
          }}
          options={[
            { value: 'all', label: 'Todos los estados' },
            { value: 'completed', label: 'Completadas' },
            { value: 'in-progress', label: 'En progreso' },
          ]}
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
        emptyState={<EmptyState title="Sin progreso registrado" description="Ningún cliente ha registrado avance de lectura todavía." />}
      />

      <TablePagination meta={query.data?.meta} onPageChange={setPage} />
    </div>
  );
}
