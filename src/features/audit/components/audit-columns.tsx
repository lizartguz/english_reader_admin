import type { ColumnDef } from '@/core/ui/tables/DataTable';
import { Eye } from 'lucide-react';
import { ActionDropdown, type RowAction } from '@/core/ui/misc/ActionDropdown';
import { formatDateTime } from '@/core/utils/format-date';
import type { AuditLog } from '../types/audit-log.types';

export function getAuditColumns({
  onViewDetail,
}: {
  onViewDetail: (log: AuditLog) => void;
}): ColumnDef<AuditLog>[] {
  return [
    {
      accessorKey: 'createdAt',
      header: 'Fecha',
      cell: ({ row }) => formatDateTime(row.original.createdAt),
    },
    {
      accessorKey: 'actor',
      header: 'Actor',
      cell: ({ row }) => row.original.actor?.fullName ?? 'Sistema',
    },
    { accessorKey: 'action', header: 'Acción' },
    { accessorKey: 'entityType', header: 'Entidad' },
    {
      accessorKey: 'summary',
      header: 'Resumen',
      cell: ({ row }) => <span className="line-clamp-1 max-w-md">{row.original.summary}</span>,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const log = row.original;
        const actions: RowAction[] = [
          { key: 'detail', label: 'Ver detalle', icon: Eye, onSelect: () => onViewDetail(log) },
        ];
        return <ActionDropdown actions={actions} label="Ver detalle del evento" />;
      },
    },
  ];
}
