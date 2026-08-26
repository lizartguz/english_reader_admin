import type { ColumnDef } from '@/core/ui/tables/DataTable';
import { StatusBadge } from '@/core/ui/misc/StatusBadge';
import type { Role } from '../types/role.types';

export function getRoleColumns(): ColumnDef<Role>[] {
  return [
    { accessorKey: 'code', header: 'Código' },
    { accessorKey: 'name', header: 'Nombre' },
    {
      accessorKey: 'description',
      header: 'Descripción',
      cell: ({ row }) => row.original.description ?? '—',
    },
    {
      accessorKey: 'isSystem',
      header: 'Tipo',
      cell: ({ row }) =>
        row.original.isSystem ? (
          <StatusBadge label="Sistema" tone="info" />
        ) : (
          <StatusBadge label="Personalizado" tone="neutral" />
        ),
    },
    {
      accessorKey: 'permissions',
      header: 'Permisos asignados',
      cell: ({ row }) => row.original.permissions.length,
    },
  ];
}
