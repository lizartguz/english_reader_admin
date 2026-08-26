import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/core/ui/layout/PageHeader';
import { FilterBar } from '@/core/ui/misc/FilterBar';
import { FilterSelect } from '@/core/ui/misc/FilterSelect';
import { DataTable } from '@/core/ui/tables/DataTable';
import { TablePagination } from '@/core/ui/tables/TablePagination';
import { EmptyState } from '@/core/ui/feedback/EmptyState';
import { DEFAULT_PAGE_SIZE } from '@/core/config/constants';
import { useRolesQuery } from '../hooks/use-roles-query';
import { getRoleColumns } from '../components/roles-columns';
import { RolePermissionsModal } from '../components/RolePermissionsModal';
import type { Role, RoleFilters } from '../types/role.types';

export function RolesPage() {
  const [search, setSearch] = useState('');
  const [tipo, setTipo] = useState<'all' | 'system' | 'custom'>('all');
  const [page, setPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const filters: RoleFilters = useMemo(
    () => ({ search: search || undefined, page, limit: DEFAULT_PAGE_SIZE }),
    [search, page],
  );

  const query = useRolesQuery(filters);

  // La API no filtra por `isSystem`, así que se resuelve sobre la página ya
  // cargada. Los roles son pocos y caben en una sola página.
  const roles = useMemo(() => {
    const items = query.data?.items ?? [];
    if (tipo === 'all') return items;
    return items.filter((role) => (tipo === 'system' ? role.isSystem : !role.isSystem));
  }, [query.data, tipo]);

  const columns = getRoleColumns();

  function clearFilters() {
    setSearch('');
    setTipo('all');
    setPage(1);
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Roles y permisos"
        description="Haz clic en un rol para marcar los permisos que debe tener."
      />

      <FilterBar onClear={clearFilters} hasActiveFilters={Boolean(search) || tipo !== 'all'}>
        <div className="relative w-64">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            placeholder="Buscar por código o nombre…"
            className="pl-8"
            value={search}
            onChange={(event) => {
              setPage(1);
              setSearch(event.target.value);
            }}
          />
        </div>
        <FilterSelect
          aria-label="Filtrar por tipo de rol"
          value={tipo}
          onValueChange={(value) => setTipo(value as 'all' | 'system' | 'custom')}
          options={[
            { value: 'all', label: 'Todos los tipos' },
            { value: 'system', label: 'Del sistema' },
            { value: 'custom', label: 'Personalizados' },
          ]}
        />
      </FilterBar>

      <DataTable
        columns={columns}
        data={roles}
        isLoading={query.isLoading}
        isError={query.isError}
        error={query.error}
        onRetry={() => query.refetch()}
        getRowId={(row) => row.id}
        onRowClick={setSelectedRole}
        emptyState={<EmptyState title="Sin roles" description="No se encontraron roles con los filtros actuales." />}
      />

      <TablePagination meta={query.data?.meta} onPageChange={setPage} />

      <RolePermissionsModal
        key={selectedRole?.id}
        role={selectedRole}
        onOpenChange={(open) => !open && setSelectedRole(null)}
      />
    </div>
  );
}
