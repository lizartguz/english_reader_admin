import type { ColumnDef } from '@/core/ui/tables/DataTable';
import { Archive, Eye, FileUp, Pencil, Send, Trash2, Undo2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StatusBadge, type StatusTone } from '@/core/ui/misc/StatusBadge';
import { ActionDropdown, type RowAction } from '@/core/ui/misc/ActionDropdown';
import { formatDate } from '@/core/utils/format-date';
import type { StoryListItem, StoryStatus } from '../types/story.types';

const STATUS_LABELS: Record<StoryStatus, string> = {
  draft: 'Borrador',
  published: 'Publicada',
  archived: 'Archivada',
};

const STATUS_TONES: Record<StoryStatus, StatusTone> = {
  draft: 'warning',
  published: 'success',
  archived: 'neutral',
};

interface ColumnActions {
  canUpdate: boolean;
  onView: (story: StoryListItem) => void;
  canPublish: boolean;
  canDelete: boolean;
  canManageFiles: boolean;
  onEdit: (story: StoryListItem) => void;
  onChangeStatus: (story: StoryListItem, status: StoryStatus) => void;
  onAssets: (story: StoryListItem) => void;
  onDelete: (story: StoryListItem) => void;
}

export function getStoryColumns({
  canUpdate,
  onView,
  canPublish,
  canDelete,
  canManageFiles,
  onEdit,
  onChangeStatus,
  onAssets,
  onDelete,
}: ColumnActions): ColumnDef<StoryListItem>[] {
  return [
    { accessorKey: 'title', header: 'Título' },
    {
      accessorKey: 'readingLevel',
      header: 'Nivel',
      cell: ({ row }) => <Badge variant="secondary">{row.original.readingLevel.code}</Badge>,
    },
    {
      accessorKey: 'genres',
      header: 'Géneros',
      cell: ({ row }) =>
        row.original.genres.length === 0 ? (
          '—'
        ) : (
          <div className="flex flex-wrap gap-1">
            {row.original.genres.map((genre) => (
              <Badge key={genre.id} variant="outline">
                {genre.name}
              </Badge>
            ))}
          </div>
        ),
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => (
        <StatusBadge label={STATUS_LABELS[row.original.status]} tone={STATUS_TONES[row.original.status]} />
      ),
    },
    {
      accessorKey: 'publishedAt',
      header: 'Publicación',
      cell: ({ row }) => formatDate(row.original.publishedAt),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Actualizado',
      cell: ({ row }) => formatDate(row.original.updatedAt),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const story = row.original;
        const actions: RowAction[] = [
          { key: 'view', label: 'Ver', icon: Eye, onSelect: () => onView(story) },
          { key: 'edit', label: 'Editar', icon: Pencil, visible: canUpdate, onSelect: () => onEdit(story) },
          {
            key: 'assets',
            label: 'Recursos',
            icon: FileUp,
            visible: canManageFiles,
            onSelect: () => onAssets(story),
          },
          {
            key: 'publish',
            label: 'Publicar',
            icon: Send,
            visible: canPublish && story.status !== 'published',
            onSelect: () => onChangeStatus(story, 'published'),
          },
          {
            key: 'draft',
            label: 'Pasar a borrador',
            icon: Undo2,
            visible: canPublish && story.status !== 'draft',
            onSelect: () => onChangeStatus(story, 'draft'),
          },
          {
            key: 'archive',
            label: 'Archivar',
            icon: Archive,
            visible: canPublish && story.status !== 'archived',
            onSelect: () => onChangeStatus(story, 'archived'),
          },
          {
            key: 'delete',
            label: 'Eliminar',
            icon: Trash2,
            visible: canDelete,
            destructive: true,
            separatorBefore: true,
            onSelect: () => onDelete(story),
          },
        ];
        return <ActionDropdown actions={actions} label={`Acciones para ${story.title}`} />;
      },
    },
  ];
}
