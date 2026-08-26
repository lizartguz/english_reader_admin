import type { ColumnDef } from '@/core/ui/tables/DataTable';
import { Badge } from '@/components/ui/badge';
import type { Permission } from '../types/permission.types';

export function getPermissionColumns(): ColumnDef<Permission>[] {
  return [
    {
      accessorKey: 'module',
      header: 'Módulo',
      cell: ({ row }) => <Badge variant="secondary">{row.original.module}</Badge>,
    },
    { accessorKey: 'action', header: 'Acción' },
    {
      accessorKey: 'code',
      header: 'Código',
      cell: ({ row }) => <code className="text-xs text-muted-foreground">{row.original.code}</code>,
    },
    {
      accessorKey: 'description',
      header: 'Descripción',
      cell: ({ row }) => row.original.description ?? '—',
    },
  ];
}
