import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/core/ui/layout/PageHeader';
import { FilterBar } from '@/core/ui/misc/FilterBar';
import { FilterSelect } from '@/core/ui/misc/FilterSelect';
import { PermissionGate } from '@/core/ui/misc/PermissionGate';
import { DataTable } from '@/core/ui/tables/DataTable';
import { TablePagination } from '@/core/ui/tables/TablePagination';
import { ConfirmDialog } from '@/core/ui/feedback/ConfirmDialog';
import { EmptyState } from '@/core/ui/feedback/EmptyState';
import { AppFeedback } from '@/core/ui/feedback/AppFeedback';
import { toFriendlyMessage } from '@/core/errors/friendly-error';
import { AdminMessages, DEFAULT_PAGE_SIZE } from '@/core/config/constants';
import { usePermissions } from '@/core/auth/permission-checker';
import { PermissionCode } from '@/core/permissions/permissions.enum';
import { useDebouncedValue } from '@/core/hooks/use-debounced-value';
import { useReadingLevelsQuery } from '@/features/reading-levels/hooks/use-reading-levels-query';
import { useChangeStoryStatus, useDeleteStory, useStoriesQuery } from '../hooks/use-stories';
import { getStoryColumns } from '../components/stories-columns';
import { StoryFormModal } from '../components/StoryFormModal';
import { StoryAssetsModal } from '../components/StoryAssetsModal';
import { StoryDetailDialog } from '../components/StoryDetailDialog';
import type { StoryFilters, StoryListItem, StoryStatus } from '../types/story.types';

type StatusFilter = 'all' | StoryStatus;

export function StoriesPage() {
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission(PermissionCode.StoriesCreate);
  const canUpdate = hasPermission(PermissionCode.StoriesUpdate);
  const canPublish = hasPermission(PermissionCode.StoriesPublish);
  const canDelete = hasPermission(PermissionCode.StoriesDelete);
  const canManageFiles = hasPermission(PermissionCode.FilesUpload) || hasPermission(PermissionCode.FilesDelete);

  const [search, setSearch] = useState('');
  const searchDiferido = useDebouncedValue(search);
  const [status, setStatus] = useState<StatusFilter>('all');
  const [readingLevelId, setReadingLevelId] = useState('all');
  const [publishedFrom, setPublishedFrom] = useState('');
  const [publishedTo, setPublishedTo] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  // Solo estas columnas están en la lista permitida de `sort` de la API.
  const [sort, setSort] = useState('updatedAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const [formOpen, setFormOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<StoryListItem | null>(null);
  const [viewingStory, setViewingStory] = useState<StoryListItem | null>(null);
  const [assetsStory, setAssetsStory] = useState<StoryListItem | null>(null);
  const [deletingStory, setDeletingStory] = useState<StoryListItem | null>(null);

  const levelsQuery = useReadingLevelsQuery({ isActive: true, limit: 100 });

  const filters: StoryFilters = useMemo(
    () => ({
      search: searchDiferido || undefined,
      status: status === 'all' ? undefined : status,
      readingLevelId: readingLevelId === 'all' ? undefined : readingLevelId,
      // El input entrega `YYYY-MM-DD`; la API espera ISO 8601 completo.
      publishedFrom: publishedFrom ? new Date(`${publishedFrom}T00:00:00`).toISOString() : undefined,
      publishedTo: publishedTo ? new Date(`${publishedTo}T23:59:59`).toISOString() : undefined,
      page,
      limit: pageSize,
      sort,
      order,
    }),
    [searchDiferido, status, readingLevelId, publishedFrom, publishedTo, page, pageSize, sort, order],
  );

  const query = useStoriesQuery(filters);
  const statusMutation = useChangeStoryStatus();
  const deleteMutation = useDeleteStory();

  const hasActiveFilters =
    Boolean(search) ||
    status !== 'all' ||
    readingLevelId !== 'all' ||
    Boolean(publishedFrom) ||
    Boolean(publishedTo);

  function clearFilters() {
    setSearch('');
    setStatus('all');
    setReadingLevelId('all');
    setPublishedFrom('');
    setPublishedTo('');
    setPage(1);
  }

  function changeStatus(story: StoryListItem, nextStatus: StoryStatus) {
    statusMutation.mutate(
      { id: story.id, status: nextStatus },
      {
        onSuccess: () => AppFeedback.success(AdminMessages.UpdatedSuccess),
        onError: (error) => AppFeedback.error({ title: toFriendlyMessage(error) }),
      },
    );
  }

  function confirmDelete() {
    if (!deletingStory) return;
    deleteMutation.mutate(deletingStory.id, {
      onSuccess: () => {
        AppFeedback.success(AdminMessages.DeletedSuccess);
        setDeletingStory(null);
      },
      onError: (error) => AppFeedback.error({ title: toFriendlyMessage(error) }),
    });
  }

  const columns = getStoryColumns({
    canUpdate,
    onView: setViewingStory,
    canPublish,
    canDelete,
    canManageFiles,
    onEdit: (story) => {
      setEditingStory(story);
      setFormOpen(true);
    },
    onChangeStatus: changeStatus,
    onAssets: setAssetsStory,
    onDelete: setDeletingStory,
  });

  return (
    <div className="space-y-4">
      <PageHeader title="Historias" description="Contenido de lectura publicado en la aplicación." />

      <FilterBar
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
        actions={
          <PermissionGate permission={PermissionCode.StoriesCreate}>
            <Button
              onClick={() => {
                setEditingStory(null);
                setFormOpen(true);
              }}
              className="bg-emerald-600 text-white hover:bg-emerald-600/90"
            >
              <Plus /> Crear historia
            </Button>
          </PermissionGate>
        }
      >
        <div className="relative w-60">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            placeholder="Buscar por título…"
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
          value={status}
          onValueChange={(value) => {
            setPage(1);
            setStatus(value as StatusFilter);
          }}
          options={[
            { value: 'all', label: 'Todos los estados' },
            { value: 'draft', label: 'Borrador' },
            { value: 'published', label: 'Publicadas' },
            { value: 'archived', label: 'Archivadas' },
          ]}
        />
        <FilterSelect
          aria-label="Filtrar por nivel"
          value={readingLevelId}
          onValueChange={(value) => {
            setPage(1);
            setReadingLevelId(value);
          }}
          options={[
            { value: 'all', label: 'Todos los niveles' },
            ...(levelsQuery.data?.items ?? []).map((level) => ({ value: level.id, label: level.code })),
          ]}
        />
        <div className="space-y-1.5">
          <Label htmlFor="publishedFrom" className="text-xs text-muted-foreground">
            Publicada desde
          </Label>
          <Input
            id="publishedFrom"
            type="date"
            className="w-40"
            value={publishedFrom}
            max={publishedTo || undefined}
            onChange={(event) => {
              setPage(1);
              setPublishedFrom(event.target.value);
            }}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="publishedTo" className="text-xs text-muted-foreground">
            Publicada hasta
          </Label>
          <Input
            id="publishedTo"
            type="date"
            className="w-40"
            value={publishedTo}
            min={publishedFrom || undefined}
            onChange={(event) => {
              setPage(1);
              setPublishedTo(event.target.value);
            }}
          />
        </div>
      </FilterBar>

      <DataTable
        columns={columns}
        data={query.data?.items ?? []}
        isLoading={query.isLoading}
        isError={query.isError}
        error={query.error}
        onRetry={() => query.refetch()}
        getRowId={(row) => row.id}
        emptyState={<EmptyState title="Sin historias" description="No se encontraron historias con los filtros actuales." />}
        sorting={{
          sortableColumns: ['title', 'publishedAt', 'updatedAt'],
          field: sort,
          order,
          onSortChange: (field, nextOrder) => {
            setPage(1);
            setSort(field);
            setOrder(nextOrder);
          },
        }}
      />

      <TablePagination
        meta={query.data?.meta}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPage(1);
          setPageSize(size);
        }}
      />

      {(canCreate || canUpdate) && (
        <StoryFormModal
          key={formOpen ? (editingStory?.id ?? 'create') : 'closed'}
          open={formOpen}
          onOpenChange={setFormOpen}
          story={editingStory}
        />
      )}

      <StoryDetailDialog
        key={viewingStory?.id}
        story={viewingStory}
        onOpenChange={(open) => !open && setViewingStory(null)}
      />

      <StoryAssetsModal
        key={assetsStory?.id}
        story={assetsStory}
        onOpenChange={(open) => !open && setAssetsStory(null)}
      />

      <ConfirmDialog
        open={Boolean(deletingStory)}
        onOpenChange={(open) => !open && setDeletingStory(null)}
        title="¿Deseas eliminar esta historia?"
        description="Dejará de estar disponible en la aplicación junto con sus recursos."
        confirmLabel="Eliminar"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
