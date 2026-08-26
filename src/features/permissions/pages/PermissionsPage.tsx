import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FilterSelect } from '@/core/ui/misc/FilterSelect';
import { PageHeader } from '@/core/ui/layout/PageHeader';
import { FilterBar } from '@/core/ui/misc/FilterBar';
import { DataTable } from '@/core/ui/tables/DataTable';
import { EmptyState } from '@/core/ui/feedback/EmptyState';
import { usePermissionsQuery } from '../hooks/use-permissions-query';
import { getPermissionColumns } from '../components/permissions-columns';

/**
 * Catálogo de permisos, de solo lectura (doc 10). Los permisos se definen en
 * código (`PermissionCode`), no se crean ni editan desde el panel.
 */
export function PermissionsPage() {
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');

  const query = usePermissionsQuery();

  const modules = useMemo(() => {
    const unique = new Set((query.data ?? []).map((permission) => permission.module));
    return Array.from(unique).sort();
  }, [query.data]);

  const filteredData = useMemo(() => {
    const items = query.data ?? [];
    const term = search.trim().toLowerCase();

    return items.filter((permission) => {
      const matchesModule = moduleFilter === 'all' || permission.module === moduleFilter;
      const matchesSearch =
        !term ||
        permission.code.toLowerCase().includes(term) ||
        (permission.description?.toLowerCase().includes(term) ?? false);
      return matchesModule && matchesSearch;
    });
  }, [query.data, search, moduleFilter]);

  const hasActiveFilters = Boolean(search) || moduleFilter !== 'all';

  function clearFilters() {
    setSearch('');
    setModuleFilter('all');
  }

  const columns = getPermissionColumns();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Permisos"
        description="Catálogo de permisos del sistema. Se definen en código; aquí solo se consultan."
      />

      <FilterBar onClear={clearFilters} hasActiveFilters={hasActiveFilters}>
        <div className="relative w-64">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            placeholder="Buscar por código o descripción…"
            className="pl-8"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <FilterSelect
          aria-label="Filtrar por módulo"
          value={moduleFilter}
          onValueChange={setModuleFilter}
          options={[
            { value: 'all', label: 'Todos los módulos' },
            ...modules.map((moduleName) => ({ value: moduleName, label: moduleName })),
          ]}
        />
      </FilterBar>

      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={query.isLoading}
        isError={query.isError}
        error={query.error}
        onRetry={() => query.refetch()}
        getRowId={(row) => row.id}
        emptyState={<EmptyState title="Sin resultados" description="Ningún permiso coincide con la búsqueda." />}
      />
    </div>
  );
}
