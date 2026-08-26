import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilterSelect } from '@/core/ui/misc/FilterSelect';
import { PageHeader } from '@/core/ui/layout/PageHeader';
import { FilterBar } from '@/core/ui/misc/FilterBar';
import { PermissionGate } from '@/core/ui/misc/PermissionGate';
import { DataTable } from '@/core/ui/tables/DataTable';
import { TablePagination } from '@/core/ui/tables/TablePagination';
import { ConfirmDialog } from '@/core/ui/feedback/ConfirmDialog';
import { AppFeedback } from '@/core/ui/feedback/AppFeedback';
import { toFriendlyMessage } from '@/core/errors/friendly-error';
import { AdminMessages, DEFAULT_PAGE_SIZE } from '@/core/config/constants';
import { usePermissions } from '@/core/auth/permission-checker';
import { PermissionCode } from '@/core/permissions/permissions.enum';
import { useGenresQuery } from '../hooks/use-genres-query';
import { useDeleteGenre, useUpdateGenre } from '../hooks/use-genre-mutations';
import { getGenreColumns } from '../components/genres-columns';
import { GenreFormModal } from '../components/GenreFormModal';
import type { Genre, GenreFilters } from '../types/genre.types';

type ActiveFilter = 'all' | 'active' | 'inactive';

export function GenresPage() {
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission(PermissionCode.GenresCreate);
  const canUpdate = hasPermission(PermissionCode.GenresUpdate);
  const canDelete = hasPermission(PermissionCode.GenresDelete);

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all');
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [deletingGenre, setDeletingGenre] = useState<Genre | null>(null);

  const filters: GenreFilters = useMemo(
    () => ({
      search: search || undefined,
      isActive: activeFilter === 'all' ? undefined : activeFilter === 'active',
      page,
      limit: DEFAULT_PAGE_SIZE,
    }),
    [search, activeFilter, page],
  );

  const query = useGenresQuery(filters);
  const updateMutation = useUpdateGenre();
  const deleteMutation = useDeleteGenre();

  const hasActiveFilters = Boolean(search) || activeFilter !== 'all';

  function clearFilters() {
    setSearch('');
    setActiveFilter('all');
    setPage(1);
  }

  function openCreateModal() {
    setEditingGenre(null);
    setFormOpen(true);
  }

  function openEditModal(genre: Genre) {
    setEditingGenre(genre);
    setFormOpen(true);
  }

  function toggleActive(genre: Genre) {
    updateMutation.mutate(
      { id: genre.id, payload: { isActive: !genre.isActive } },
      {
        onSuccess: () => AppFeedback.success(AdminMessages.UpdatedSuccess),
        onError: (error) => AppFeedback.error({ title: toFriendlyMessage(error) }),
      },
    );
  }

  function confirmDelete() {
    if (!deletingGenre) return;
    deleteMutation.mutate(deletingGenre.id, {
      onSuccess: () => {
        AppFeedback.success(AdminMessages.DeletedSuccess);
        setDeletingGenre(null);
      },
      onError: (error) => AppFeedback.error({ title: toFriendlyMessage(error) }),
    });
  }

  const columns = getGenreColumns({
    canUpdate,
    canDelete,
    onEdit: openEditModal,
    onToggleActive: toggleActive,
    onDelete: setDeletingGenre,
  });

  return (
    <div className="space-y-4">
      <PageHeader title="Géneros" description="Administra los géneros literarios usados para clasificar historias." />

      <FilterBar
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
        actions={
          <PermissionGate permission={PermissionCode.GenresCreate}>
            <Button onClick={openCreateModal} className="bg-emerald-600 text-white hover:bg-emerald-600/90">
              <Plus /> Crear género
            </Button>
          </PermissionGate>
        }
      >
        <div className="relative w-56">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            placeholder="Buscar por nombre o código…"
            className="pl-8"
            value={search}
            onChange={(event) => {
              setPage(1);
              setSearch(event.target.value);
            }}
          />
        </div>
        <FilterSelect
          aria-label="Filtrar por estado"
          value={activeFilter}
          onValueChange={(value) => {
            setPage(1);
            setActiveFilter(value as ActiveFilter);
          }}
          options={[
            { value: 'all', label: 'Todos los estados' },
            { value: 'active', label: 'Activos' },
            { value: 'inactive', label: 'Inactivos' },
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
      />

      <TablePagination meta={query.data?.meta} onPageChange={setPage} />

      {canCreate || canUpdate ? (
        <GenreFormModal
          key={formOpen ? (editingGenre?.id ?? 'create') : 'closed'}
          open={formOpen}
          onOpenChange={setFormOpen}
          genre={editingGenre}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(deletingGenre)}
        onOpenChange={(open) => !open && setDeletingGenre(null)}
        title="¿Deseas eliminar este género?"
        description="Esta acción puede afectar la información visible en la aplicación."
        confirmLabel="Eliminar"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
