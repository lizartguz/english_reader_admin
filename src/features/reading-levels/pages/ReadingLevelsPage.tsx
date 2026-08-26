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
import { useReadingLevelsQuery } from '../hooks/use-reading-levels-query';
import { useDeleteReadingLevel, useUpdateReadingLevel } from '../hooks/use-reading-level-mutations';
import { getReadingLevelColumns } from '../components/reading-levels-columns';
import { ReadingLevelFormModal } from '../components/ReadingLevelFormModal';
import type { ReadingLevel, ReadingLevelFilters } from '../types/reading-level.types';

type ActiveFilter = 'all' | 'active' | 'inactive';

export function ReadingLevelsPage() {
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission(PermissionCode.ReadingLevelsCreate);
  const canUpdate = hasPermission(PermissionCode.ReadingLevelsUpdate);
  const canDelete = hasPermission(PermissionCode.ReadingLevelsDelete);

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all');
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<ReadingLevel | null>(null);
  const [deletingLevel, setDeletingLevel] = useState<ReadingLevel | null>(null);

  const filters: ReadingLevelFilters = useMemo(
    () => ({
      search: search || undefined,
      isActive: activeFilter === 'all' ? undefined : activeFilter === 'active',
      page,
      limit: DEFAULT_PAGE_SIZE,
    }),
    [search, activeFilter, page],
  );

  const query = useReadingLevelsQuery(filters);
  const updateMutation = useUpdateReadingLevel();
  const deleteMutation = useDeleteReadingLevel();

  const hasActiveFilters = Boolean(search) || activeFilter !== 'all';

  function clearFilters() {
    setSearch('');
    setActiveFilter('all');
    setPage(1);
  }

  function openCreateModal() {
    setEditingLevel(null);
    setFormOpen(true);
  }

  function openEditModal(level: ReadingLevel) {
    setEditingLevel(level);
    setFormOpen(true);
  }

  function toggleActive(level: ReadingLevel) {
    updateMutation.mutate(
      { id: level.id, payload: { isActive: !level.isActive } },
      {
        onSuccess: () => AppFeedback.success(AdminMessages.UpdatedSuccess),
        onError: (error) => AppFeedback.error({ title: toFriendlyMessage(error) }),
      },
    );
  }

  function confirmDelete() {
    if (!deletingLevel) return;
    deleteMutation.mutate(deletingLevel.id, {
      onSuccess: () => {
        AppFeedback.success(AdminMessages.DeletedSuccess);
        setDeletingLevel(null);
      },
      onError: (error) => AppFeedback.error({ title: toFriendlyMessage(error) }),
    });
  }

  const columns = getReadingLevelColumns({
    canUpdate,
    canDelete,
    onEdit: openEditModal,
    onToggleActive: toggleActive,
    onDelete: setDeletingLevel,
  });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Niveles de lectura"
        description="Administra los niveles usados para clasificar historias."
      />

      <FilterBar
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
        actions={
          <PermissionGate permission={PermissionCode.ReadingLevelsCreate}>
            <Button onClick={openCreateModal} className="bg-emerald-600 text-white hover:bg-emerald-600/90">
              <Plus /> Crear nivel
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
        <ReadingLevelFormModal
          key={formOpen ? (editingLevel?.id ?? 'create') : 'closed'}
          open={formOpen}
          onOpenChange={setFormOpen}
          readingLevel={editingLevel}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(deletingLevel)}
        onOpenChange={(open) => !open && setDeletingLevel(null)}
        title="¿Deseas eliminar este nivel de lectura?"
        description="Esta acción puede afectar la información visible en la aplicación."
        confirmLabel="Eliminar"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
