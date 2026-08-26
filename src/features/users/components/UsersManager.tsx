import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilterSelect } from '@/core/ui/misc/FilterSelect';
import { PageHeader } from '@/core/ui/layout/PageHeader';
import { FilterBar } from '@/core/ui/misc/FilterBar';
import { DataTable } from '@/core/ui/tables/DataTable';
import { TablePagination } from '@/core/ui/tables/TablePagination';
import { ConfirmDialog } from '@/core/ui/feedback/ConfirmDialog';
import { EmptyState } from '@/core/ui/feedback/EmptyState';
import { AppFeedback } from '@/core/ui/feedback/AppFeedback';
import { toFriendlyMessage } from '@/core/errors/friendly-error';
import { AdminMessages, DEFAULT_PAGE_SIZE } from '@/core/config/constants';
import { usePermissions } from '@/core/auth/permission-checker';
import { PermissionCode } from '@/core/permissions/permissions.enum';
import type { RoleCode } from '@/core/permissions/roles.enum';
import { useUsersQuery } from '../hooks/use-users-query';
import { useChangeUserStatus, useDeleteUser } from '../hooks/use-user-mutations';
import { getUserColumns } from './users-columns';
import { UserFormModal } from './UserFormModal';
import { UserRolesModal } from './UserRolesModal';
import { UserDetailDialog } from './UserDetailDialog';
import type { AdminUser, UserFilters, UserStatus } from '../types/user.types';

type StatusFilter = 'all' | UserStatus;

interface UsersManagerProps {
  title: string;
  description: string;
  /** Roles por los que se filtra el listado (clientes vs. administradores). */
  roleCodes: RoleCode[];
  /** Rol que se asigna al crear desde esta pantalla. */
  defaultRoleCode: RoleCode;
  /** Los administradores muestran su columna de roles; los clientes no. */
  showRoles: boolean;
  createLabel: string;
}

/**
 * Gestión de usuarios compartida por las pantallas de clientes y de
 * administradores. Ambas consumen el mismo CRUD de la API (`/admin/users`),
 * que se segmenta con el filtro de roles.
 */
export function UsersManager({
  title,
  description,
  roleCodes,
  defaultRoleCode,
  showRoles,
  createLabel,
}: UsersManagerProps) {
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission(PermissionCode.UsersCreate);
  const canUpdate = hasPermission(PermissionCode.UsersUpdate);
  const canDelete = hasPermission(PermissionCode.UsersDelete);
  const canAssignRoles = hasPermission(PermissionCode.RolesAssign);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [viewingUser, setViewingUser] = useState<AdminUser | null>(null);
  const [rolesUser, setRolesUser] = useState<AdminUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);

  const filters: UserFilters = useMemo(
    () => ({
      search: search || undefined,
      status: status === 'all' ? undefined : status,
      roleCode: roleCodes,
      page,
      limit: DEFAULT_PAGE_SIZE,
    }),
    [search, status, roleCodes, page],
  );

  const query = useUsersQuery(filters);
  const statusMutation = useChangeUserStatus();
  const deleteMutation = useDeleteUser();

  const hasActiveFilters = Boolean(search) || status !== 'all';

  function clearFilters() {
    setSearch('');
    setStatus('all');
    setPage(1);
  }

  function openCreateModal() {
    setEditingUser(null);
    setFormOpen(true);
  }

  function openEditModal(user: AdminUser) {
    setEditingUser(user);
    setFormOpen(true);
  }

  function changeStatus(user: AdminUser, nextStatus: 'active' | 'inactive' | 'blocked') {
    statusMutation.mutate(
      { id: user.id, status: nextStatus },
      {
        onSuccess: () => AppFeedback.success(AdminMessages.UpdatedSuccess),
        onError: (error) => AppFeedback.error({ title: toFriendlyMessage(error) }),
      },
    );
  }

  function confirmDelete() {
    if (!deletingUser) return;
    deleteMutation.mutate(deletingUser.id, {
      onSuccess: () => {
        AppFeedback.success(AdminMessages.DeletedSuccess);
        setDeletingUser(null);
      },
      onError: (error) => AppFeedback.error({ title: toFriendlyMessage(error) }),
    });
  }

  const columns = getUserColumns({
    canUpdate,
    onView: setViewingUser,
    canDelete,
    canAssignRoles,
    showRoles,
    onEdit: openEditModal,
    onToggleActive: (user) => changeStatus(user, user.status === 'active' ? 'inactive' : 'active'),
    onToggleBlocked: (user) => changeStatus(user, user.status === 'blocked' ? 'active' : 'blocked'),
    onAssignRoles: setRolesUser,
    onDelete: setDeletingUser,
  });

  return (
    <div className="space-y-4">
      <PageHeader title={title} description={description} />

      <FilterBar
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
        actions={
          canCreate ? (
            <Button onClick={openCreateModal} className="bg-emerald-600 text-white hover:bg-emerald-600/90">
              <Plus /> {createLabel}
            </Button>
          ) : null
        }
      >
        <div className="relative w-64">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            placeholder="Buscar por nombre o correo…"
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
            { value: 'active', label: 'Activos' },
            { value: 'inactive', label: 'Inactivos' },
            { value: 'blocked', label: 'Bloqueados' },
            { value: 'pending_verification', label: 'Pendientes' },
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
        emptyState={<EmptyState title="Sin usuarios" description="No se encontraron usuarios con los filtros actuales." />}
      />

      <TablePagination meta={query.data?.meta} onPageChange={setPage} />

      {(canCreate || canUpdate) && (
        <UserFormModal
          key={formOpen ? (editingUser?.id ?? 'create') : 'closed'}
          open={formOpen}
          onOpenChange={setFormOpen}
          user={editingUser}
          defaultRoleCode={defaultRoleCode}
        />
      )}

      <UserDetailDialog user={viewingUser} onOpenChange={(open) => !open && setViewingUser(null)} />

      <UserRolesModal
        key={rolesUser?.id}
        user={rolesUser}
        onOpenChange={(open) => !open && setRolesUser(null)}
        availableRoles={roleCodes}
      />

      <ConfirmDialog
        open={Boolean(deletingUser)}
        onOpenChange={(open) => !open && setDeletingUser(null)}
        title="¿Deseas eliminar este usuario?"
        description="La cuenta perderá el acceso de inmediato. Esta acción se registra en la auditoría."
        confirmLabel="Eliminar"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
