import type { ColumnDef } from '@/core/ui/tables/DataTable';
import { StatusBadge } from '@/core/ui/misc/StatusBadge';
import { formatDateTime } from '@/core/utils/format-date';
import type { ReadingProgressEntry } from '../types/reading-progress.types';
import { ProgressCell } from './ProgressCell';

export function getReadingProgressColumns(): ColumnDef<ReadingProgressEntry>[] {
  return [
    {
      accessorKey: 'user',
      header: 'Cliente',
      cell: ({ row }) => `${row.original.user.firstName} ${row.original.user.lastName}`,
    },
    {
      accessorKey: 'story',
      header: 'Historia',
      cell: ({ row }) => row.original.story.title,
    },
    {
      accessorKey: 'progressPercent',
      header: 'Progreso',
      cell: ({ row }) => <ProgressCell percent={row.original.progressPercent} />,
    },
    {
      accessorKey: 'completedAt',
      header: 'Estado',
      cell: ({ row }) =>
        row.original.completedAt ? (
          <StatusBadge label="Completada" tone="success" />
        ) : (
          <StatusBadge label="En progreso" tone="info" />
        ),
    },
    {
      accessorKey: 'lastReadAt',
      header: 'Última lectura',
      cell: ({ row }) => formatDateTime(row.original.lastReadAt),
    },
  ];
}
