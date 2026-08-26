import type { ColumnDef } from '@/core/ui/tables/DataTable';
import { Ban, CheckCircle2, Eye, Pencil, ShieldCheck, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StatusBadge, type StatusTone } from '@/core/ui/misc/StatusBadge';
import { ActionDropdown, type RowAction } from '@/core/ui/misc/ActionDropdown';
import { formatDateTime } from '@/core/utils/format-date';
import type { AdminUser, UserStatus } from '../types/user.types';

const STATUS_LABELS: Record<UserStatus, string> = {
  active: 'Activo',
  inactive: 'Inactivo',
  blocked: 'Bloqueado',
  pending_verification: 'Pendiente',
};

const STATUS_TONES: Record<UserStatus, StatusTone> = {
  active: 'success',
  inactive: 'neutral',
  blocked: 'destructive',
  pending_verification: 'warning',
};

interface ColumnActions {
  canUpdate: boolean;
  onView: (user: AdminUser) => void;
  canDelete: boolean;
  canAssignRoles: boolean;
  showRoles: boolean;
  onEdit: (user: AdminUser) => void;
  onToggleActive: (user: AdminUser) => void;
  onToggleBlocked: (user: AdminUser) => void;
  onAssignRoles: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
}

export function getUserColumns({
  canUpdate,
  onView,
  canDelete,
  canAssignRoles,
  showRoles,
  onEdit,
  onToggleActive,
  onToggleBlocked,
  onAssignRoles,
  onDelete,
}: ColumnActions): ColumnDef<AdminUser>[] {
  const columns: ColumnDef<AdminUser>[] = [
    {
      accessorKey: 'fullName',
      header: 'Nombre',
      cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
    },
    { accessorKey: 'email', header: 'Correo' },
    {
      accessorKey: 'phoneNumber',
      header: 'Teléfono',
      cell: ({ row }) => row.original.phoneNumber ?? '—',
    },
  ];

  if (showRoles) {
    columns.push({
      accessorKey: 'roles',
      header: 'Roles',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.roles.map((role) => (
            <Badge key={role} variant="secondary">
              {role}
            </Badge>
          ))}
        </div>
      ),
    });
  }

  columns.push(
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => (
        <StatusBadge label={STATUS_LABELS[row.original.status]} tone={STATUS_TONES[row.original.status]} />
      ),
    },
    {
      accessorKey: 'lastLoginAt',
      header: 'Último acceso',
      cell: ({ row }) => formatDateTime(row.original.lastLoginAt),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const user = row.original;
        const isBlocked = user.status === 'blocked';
        const isActive = user.status === 'active';

        const actions: RowAction[] = [
          { key: 'view', label: 'Ver', icon: Eye, onSelect: () => onView(user) },
          { key: 'edit', label: 'Editar', icon: Pencil, visible: canUpdate, onSelect: () => onEdit(user) },
          {
            key: 'toggle-active',
            label: isActive ? 'Desactivar' : 'Activar',
            icon: CheckCircle2,
            visible: canUpdate && !isBlocked,
            onSelect: () => onToggleActive(user),
          },
          {
            key: 'toggle-blocked',
            label: isBlocked ? 'Desbloquear' : 'Bloquear',
            icon: Ban,
            visible: canUpdate,
            onSelect: () => onToggleBlocked(user),
          },
          {
            key: 'roles',
            label: 'Asignar roles',
            icon: ShieldCheck,
            visible: canAssignRoles,
            onSelect: () => onAssignRoles(user),
          },
          {
            key: 'delete',
            label: 'Eliminar',
            icon: Trash2,
            visible: canDelete,
            destructive: true,
            separatorBefore: true,
            onSelect: () => onDelete(user),
          },
        ];

        return <ActionDropdown actions={actions} label={`Acciones para ${user.fullName}`} />;
      },
    },
  );

  return columns;
}
