import { useMemo, useState } from 'react';
import { FilterSelect } from '@/core/ui/misc/FilterSelect';
import { PageHeader } from '@/core/ui/layout/PageHeader';
import { FilterBar } from '@/core/ui/misc/FilterBar';
import { DataTable } from '@/core/ui/tables/DataTable';
import { TablePagination } from '@/core/ui/tables/TablePagination';
import { EmptyState } from '@/core/ui/feedback/EmptyState';
import { DEFAULT_PAGE_SIZE } from '@/core/config/constants';
import { useVocabularyQuery } from '../hooks/use-vocabulary-query';
import { getVocabularyColumns } from '../components/vocabulary-columns';
import type { SavedWordStatus, VocabularyFilters } from '../types/vocabulary.types';

type StatusFilter = 'all' | SavedWordStatus;

export function VocabularyPage() {
  const [status, setStatus] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);

  const filters: VocabularyFilters = useMemo(
    () => ({
      status: status === 'all' ? undefined : status,
      page,
      limit: DEFAULT_PAGE_SIZE,
    }),
    [status, page],
  );

  const query = useVocabularyQuery(filters);
  const hasActiveFilters = status !== 'all';

  function clearFilters() {
    setStatus('all');
    setPage(1);
  }

  const columns = getVocabularyColumns();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Vocabulario"
        description="Palabras guardadas por los usuarios cliente. Solo lectura."
      />

      <FilterBar onClear={clearFilters} hasActiveFilters={hasActiveFilters}>
        <FilterSelect
          aria-label="Filtrar por estado"
          value={status}
          onValueChange={(value) => {
            setPage(1);
            setStatus(value as StatusFilter);
          }}
          options={[
            { value: 'all', label: 'Todos los estados' },
            { value: 'saved', label: 'Guardada' },
            { value: 'learning', label: 'Aprendiendo' },
            { value: 'learned', label: 'Aprendida' },
            { value: 'archived', label: 'Archivada' },
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
        emptyState={<EmptyState title="Sin vocabulario" description="Ningún cliente ha guardado palabras todavía." />}
      />

      <TablePagination meta={query.data?.meta} onPageChange={setPage} />
    </div>
  );
}
