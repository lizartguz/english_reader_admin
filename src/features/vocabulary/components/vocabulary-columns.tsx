import type { ColumnDef } from '@/core/ui/tables/DataTable';
import { StatusBadge, type StatusTone } from '@/core/ui/misc/StatusBadge';
import { formatDateTime } from '@/core/utils/format-date';
import type { SavedWordStatus, VocabularyEntry } from '../types/vocabulary.types';

const STATUS_LABELS: Record<SavedWordStatus, string> = {
  saved: 'Guardada',
  learning: 'Aprendiendo',
  learned: 'Aprendida',
  archived: 'Archivada',
};

const STATUS_TONES: Record<SavedWordStatus, StatusTone> = {
  saved: 'info',
  learning: 'warning',
  learned: 'success',
  archived: 'neutral',
};

export function getVocabularyColumns(): ColumnDef<VocabularyEntry>[] {
  return [
    {
      accessorKey: 'word',
      header: 'Palabra',
      cell: ({ row }) => row.original.word.word,
    },
    {
      accessorKey: 'user',
      header: 'Cliente',
      cell: ({ row }) => `${row.original.user.firstName} ${row.original.user.lastName}`,
    },
    {
      accessorKey: 'story',
      header: 'Historia',
      cell: ({ row }) => row.original.story?.title ?? '—',
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => (
        <StatusBadge label={STATUS_LABELS[row.original.status]} tone={STATUS_TONES[row.original.status]} />
      ),
    },
    {
      accessorKey: 'savedAt',
      header: 'Guardada',
      cell: ({ row }) => formatDateTime(row.original.savedAt),
    },
    {
      accessorKey: 'lastReviewedAt',
      header: 'Última revisión',
      cell: ({ row }) => formatDateTime(row.original.lastReviewedAt),
    },
  ];
}
