import { Badge } from '@/components/ui/badge';
import { DetailDialog, DetailRow } from '@/core/ui/feedback/DetailDialog';
import { CircularLoader } from '@/core/ui/feedback/CircularLoader';
import { StatusBadge, type StatusTone } from '@/core/ui/misc/StatusBadge';
import { formatDateTime } from '@/core/utils/format-date';
import { useStoryDetailQuery } from '../hooks/use-stories';
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

/**
 * Detalle de solo lectura de una historia. El contenido completo no viaja en
 * el listado, así que se pide al abrir.
 */
export function StoryDetailDialog({
  story,
  onOpenChange,
}: {
  story: StoryListItem | null;
  onOpenChange: (open: boolean) => void;
}) {
  const detailQuery = useStoryDetailQuery(story?.id ?? null);
  const detail = detailQuery.data;

  return (
    <DetailDialog
      open={Boolean(story)}
      onOpenChange={onOpenChange}
      title={story?.title ?? 'Historia'}
      description="Detalle de la historia. Para modificarla usa la acción Editar."
      className="sm:max-w-2xl"
    >
      {detailQuery.isLoading && <CircularLoader label="Cargando historia…" />}

      {detail && (
        <>
          <DetailRow label="Autor" value={detail.author} />
          <DetailRow
            label="Estado"
            value={<StatusBadge label={STATUS_LABELS[detail.status]} tone={STATUS_TONES[detail.status]} />}
          />
          <DetailRow label="Nivel" value={`${detail.readingLevel.code} · ${detail.readingLevel.name}`} />
          <DetailRow
            label="Géneros"
            value={
              detail.genres.length === 0 ? null : (
                <span className="flex flex-wrap gap-1">
                  {detail.genres.map((genre) => (
                    <Badge key={genre.id} variant="outline">
                      {genre.name}
                    </Badge>
                  ))}
                </span>
              )
            }
          />
          <DetailRow
            label="Minutos estimados"
            value={detail.estimatedReadingMinutes ? `${detail.estimatedReadingMinutes} min` : null}
          />
          <DetailRow label="Publicación" value={formatDateTime(detail.publishedAt)} />
          <DetailRow label="Actualizada" value={formatDateTime(detail.updatedAt)} />
          <DetailRow label="Recursos" value={`${detail.assets.length}`} />
          <DetailRow label="Resumen" value={detail.summary} />

          <div className="space-y-1 pt-1">
            <p className="text-muted-foreground">Contenido</p>
            <p className="max-h-56 overflow-y-auto rounded-md bg-muted p-3 whitespace-pre-wrap">
              {detail.content}
            </p>
          </div>
        </>
      )}
    </DetailDialog>
  );
}
