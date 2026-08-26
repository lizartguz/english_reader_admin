import type { ColumnDef } from '@/core/ui/tables/DataTable';
import { Pencil, Power, Trash2 } from 'lucide-react';
import { StatusBadge } from '@/core/ui/misc/StatusBadge';
import { ActionDropdown, type RowAction } from '@/core/ui/misc/ActionDropdown';
import { formatDateTime } from '@/core/utils/format-date';
import type { Genre } from '../types/genre.types';

interface ColumnActions {
  canUpdate: boolean;
  canDelete: boolean;
  onEdit: (genre: Genre) => void;
  onToggleActive: (genre: Genre) => void;
  onDelete: (genre: Genre) => void;
}

export function getGenreColumns({
  canUpdate,
  canDelete,
  onEdit,
  onToggleActive,
  onDelete,
}: ColumnActions): ColumnDef<Genre>[] {
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
        const genre = row.original;
        const actions: RowAction[] = [
          { key: 'edit', label: 'Editar', icon: Pencil, visible: canUpdate, onSelect: () => onEdit(genre) },
          {
            key: 'toggle',
            label: genre.isActive ? 'Desactivar' : 'Activar',
            icon: Power,
            visible: canUpdate,
            onSelect: () => onToggleActive(genre),
          },
          {
            key: 'delete',
            label: 'Eliminar',
            icon: Trash2,
            visible: canDelete,
            destructive: true,
            separatorBefore: true,
            onSelect: () => onDelete(genre),
          },
        ];
        return <ActionDropdown actions={actions} label={`Acciones para ${genre.name}`} />;
      },
    },
  ];
}
