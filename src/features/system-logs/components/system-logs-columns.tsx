import type { ColumnDef } from '@/core/ui/tables/DataTable';
import { Eye } from 'lucide-react';
import { StatusBadge, type StatusTone } from '@/core/ui/misc/StatusBadge';
import { ActionDropdown, type RowAction } from '@/core/ui/misc/ActionDropdown';
import { formatDateTime } from '@/core/utils/format-date';
import type { SystemLog, SystemLogLevel } from '../types/system-log.types';

const LEVEL_LABELS: Record<SystemLogLevel, string> = {
  info: 'Info',
  warning: 'Advertencia',
  error: 'Error',
  critical: 'Crítico',
};

const LEVEL_TONES: Record<SystemLogLevel, StatusTone> = {
  info: 'info',
  warning: 'warning',
  error: 'destructive',
  critical: 'destructive',
};

export function getSystemLogColumns({
  onViewDetail,
}: {
  onViewDetail: (log: SystemLog) => void;
}): ColumnDef<SystemLog>[] {
  return [
    {
      accessorKey: 'createdAt',
      header: 'Fecha',
      cell: ({ row }) => formatDateTime(row.original.createdAt),
    },
    {
      accessorKey: 'level',
      header: 'Nivel',
      cell: ({ row }) => (
        <StatusBadge label={LEVEL_LABELS[row.original.level]} tone={LEVEL_TONES[row.original.level]} />
      ),
    },
    { accessorKey: 'source', header: 'Fuente' },
    {
      accessorKey: 'message',
      header: 'Mensaje',
      cell: ({ row }) => <span className="line-clamp-1 max-w-md">{row.original.message}</span>,
    },
    {
      accessorKey: 'requestPath',
      header: 'Ruta',
      cell: ({ row }) => row.original.requestPath ?? '—',
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const log = row.original;
        const actions: RowAction[] = [
          { key: 'detail', label: 'Ver detalle', icon: Eye, onSelect: () => onViewDetail(log) },
        ];
        return <ActionDropdown actions={actions} label="Ver detalle del registro" />;
      },
    },
  ];
}
