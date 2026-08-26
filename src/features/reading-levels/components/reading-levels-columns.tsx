import type { ColumnDef } from '@/core/ui/tables/DataTable';
import { Pencil, Power, Trash2 } from 'lucide-react';
import { StatusBadge } from '@/core/ui/misc/StatusBadge';
import { ActionDropdown, type RowAction } from '@/core/ui/misc/ActionDropdown';
import { formatDateTime } from '@/core/utils/format-date';
import type { ReadingLevel } from '../types/reading-level.types';

interface ColumnActions {
  canUpdate: boolean;
  canDelete: boolean;
  onEdit: (level: ReadingLevel) => void;
  onToggleActive: (level: ReadingLevel) => void;
  onDelete: (level: ReadingLevel) => void;
}

export function getReadingLevelColumns({
  canUpdate,
  canDelete,
  onEdit,
  onToggleActive,
  onDelete,
}: ColumnActions): ColumnDef<ReadingLevel>[] {
  return [
    { accessorKey: 'code', header: 'Código' },
    { accessorKey: 'name', header: 'Nombre' },
    { accessorKey: 'sortOrder', header: 'Orden' },
    {
      accessorKey: 'isActive',
      header: 'Estado',
      cell: ({ row }) =>
        row.original.isActive ? (
          <StatusBadge label="Activo" tone="success" />
        ) : (
          <StatusBadge label="Inactivo" tone="neutral" />
        ),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Actualizado',
      cell: ({ row }) => formatDateTime(row.original.updatedAt),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const level = row.original;
        const actions: RowAction[] = [
          {
            key: 'edit',
            label: 'Editar',
            icon: Pencil,
            visible: canUpdate,
            onSelect: () => onEdit(level),
          },
          {
            key: 'toggle',
            label: level.isActive ? 'Desactivar' : 'Activar',
            icon: Power,
            visible: canUpdate,
            onSelect: () => onToggleActive(level),
          },
          {
            key: 'delete',
            label: 'Eliminar',
            icon: Trash2,
            visible: canDelete,
            destructive: true,
            separatorBefore: true,
            onSelect: () => onDelete(level),
          },
        ];
        return <ActionDropdown actions={actions} label={`Acciones para ${level.name}`} />;
      },
    },
  ];
}
