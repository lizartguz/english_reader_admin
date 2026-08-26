import type { ColumnDef } from '@/core/ui/tables/DataTable';
import { Check, Eye, Languages, Pencil, Trash2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ActionDropdown, type RowAction } from '@/core/ui/misc/ActionDropdown';
import { formatDateTime } from '@/core/utils/format-date';
import { ReviewStatusBadge } from './ReviewStatusBadge';
import { PART_OF_SPEECH_LABELS } from '../schemas/word.schema';
import type { ReviewStatus, WordListItem } from '../types/word.types';

interface ColumnActions {
  canUpdate: boolean;
  onView: (word: WordListItem) => void;
  canReview: boolean;
  canDelete: boolean;
  canReadTranslations: boolean;
  onEdit: (word: WordListItem) => void;
  onReview: (word: WordListItem, status: ReviewStatus) => void;
  onTranslations: (word: WordListItem) => void;
  onDelete: (word: WordListItem) => void;
}

export function getWordColumns({
  canUpdate,
  onView,
  canReview,
  canDelete,
  canReadTranslations,
  onEdit,
  onReview,
  onTranslations,
  onDelete,
}: ColumnActions): ColumnDef<WordListItem>[] {
  return [
    { accessorKey: 'word', header: 'Palabra' },
    {
      accessorKey: 'phonetic',
      header: 'Fonética',
      cell: ({ row }) => row.original.phonetic ?? '—',
    },
    {
      accessorKey: 'partOfSpeech',
      header: 'Tipo',
      cell: ({ row }) =>
        row.original.partOfSpeech ? (
          <Badge variant="secondary">{PART_OF_SPEECH_LABELS[row.original.partOfSpeech]}</Badge>
        ) : (
          '—'
        ),
    },
    {
      accessorKey: 'reviewStatus',
      header: 'Revisión',
      cell: ({ row }) => <ReviewStatusBadge status={row.original.reviewStatus} />,
    },
    {
      accessorKey: 'translationsCount',
      header: 'Traducciones',
      cell: ({ row }) => row.original.translationsCount,
    },
    {
      accessorKey: 'source',
      header: 'Fuente',
      cell: ({ row }) => row.original.source ?? '—',
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
        const word = row.original;
        const actions: RowAction[] = [
          { key: 'view', label: 'Ver detalle', icon: Eye, onSelect: () => onView(word) },
          {
            key: 'translations',
            label: 'Traducciones',
            icon: Languages,
            visible: canReadTranslations,
            onSelect: () => onTranslations(word),
          },
          { key: 'edit', label: 'Editar', icon: Pencil, visible: canUpdate, onSelect: () => onEdit(word) },
          {
            key: 'approve',
            label: 'Marcar como revisada',
            icon: Check,
            visible: canReview && word.reviewStatus !== 'reviewed',
            onSelect: () => onReview(word, 'reviewed'),
          },
          {
            key: 'reject',
            label: 'Rechazar',
            icon: X,
            visible: canReview && word.reviewStatus !== 'rejected',
            onSelect: () => onReview(word, 'rejected'),
          },
          {
            key: 'delete',
            label: 'Eliminar',
            icon: Trash2,
            visible: canDelete,
            destructive: true,
            separatorBefore: true,
            onSelect: () => onDelete(word),
          },
        ];
        return <ActionDropdown actions={actions} label={`Acciones para ${word.word}`} />;
      },
    },
  ];
}
