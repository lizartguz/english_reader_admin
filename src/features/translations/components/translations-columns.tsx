import type { ColumnDef } from '@/core/ui/tables/DataTable';
import { Check, Pencil, Trash2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ActionDropdown, type RowAction } from '@/core/ui/misc/ActionDropdown';
import { formatDate } from '@/core/utils/format-date';
import { ReviewStatusBadge } from '@/features/dictionary/components/ReviewStatusBadge';
import type { TranslationListItem } from '../types/translation.types';

interface ColumnActions {
  canUpdate: boolean;
  canReview: boolean;
  canDelete: boolean;
  onReview: (translation: TranslationListItem) => void;
  onChangeStatus: (translation: TranslationListItem, status: 'reviewed' | 'rejected') => void;
  onDelete: (translation: TranslationListItem) => void;
}

export function getTranslationColumns({
  canUpdate,
  canReview,
  canDelete,
  onReview,
  onChangeStatus,
  onDelete,
}: ColumnActions): ColumnDef<TranslationListItem>[] {
  return [
    {
      accessorKey: 'word',
      header: 'Palabra',
      cell: ({ row }) => <span className="font-medium">{row.original.word.word}</span>,
    },
    { accessorKey: 'translation', header: 'Traducción' },
    {
      accessorKey: 'meaningContext',
      header: 'Contexto',
      cell: ({ row }) => row.original.meaningContext ?? '—',
    },
    {
      accessorKey: 'targetLanguage',
      header: 'Idioma',
      cell: ({ row }) => <Badge variant="outline">{row.original.targetLanguage}</Badge>,
    },
    {
      accessorKey: 'source',
      header: 'Fuente',
      cell: ({ row }) => row.original.source ?? '—',
    },
    {
      accessorKey: 'reviewStatus',
      header: 'Estado',
      cell: ({ row }) => <ReviewStatusBadge status={row.original.reviewStatus} />,
    },
    {
      accessorKey: 'reviewedBy',
      header: 'Revisado por',
      cell: ({ row }) => {
        const { reviewedBy, reviewedAt } = row.original;
        if (!reviewedBy && !reviewedAt) return '—';

        return (
          <span className="text-xs">
            {reviewedBy?.fullName ?? 'Sistema'}
            {reviewedAt && <span className="block text-muted-foreground">{formatDate(reviewedAt)}</span>}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const translation = row.original;

        // Revisar un lote pendiente es la tarea principal de esta pantalla:
        // esas filas ofrecen aprobar y rechazar directos, sin abrir el menú.
        if (translation.reviewStatus === 'pending' && canReview) {
          return (
            <div className="flex items-center justify-end gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                title="Aprobar"
                onClick={() => onChangeStatus(translation, 'reviewed')}
              >
                <Check className="text-emerald-600" />
                <span className="sr-only">Aprobar traducción de {translation.word.word}</span>
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                title="Rechazar"
                onClick={() => onChangeStatus(translation, 'rejected')}
              >
                <X className="text-destructive" />
                <span className="sr-only">Rechazar traducción de {translation.word.word}</span>
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                title="Revisar en detalle"
                onClick={() => onReview(translation)}
              >
                <Pencil />
                <span className="sr-only">Revisar traducción de {translation.word.word}</span>
              </Button>
            </div>
          );
        }

        const actions: RowAction[] = [
          {
            key: 'review',
            label: 'Editar y revisar',
            icon: Pencil,
            visible: canUpdate || canReview,
            onSelect: () => onReview(translation),
          },
          {
            key: 'approve',
            label: 'Marcar como revisada',
            icon: Check,
            visible: canReview && translation.reviewStatus !== 'reviewed',
            onSelect: () => onChangeStatus(translation, 'reviewed'),
          },
          {
            key: 'reject',
            label: 'Rechazar',
            icon: X,
            visible: canReview && translation.reviewStatus !== 'rejected',
            onSelect: () => onChangeStatus(translation, 'rejected'),
          },
          {
            key: 'delete',
            label: 'Eliminar',
            icon: Trash2,
            visible: canDelete,
            destructive: true,
            separatorBefore: true,
            onSelect: () => onDelete(translation),
          },
        ];

        return <ActionDropdown actions={actions} label={`Acciones para ${translation.word.word}`} />;
      },
    },
  ];
}
