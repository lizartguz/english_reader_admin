import { Badge } from '@/components/ui/badge';
import { DetailDialog, DetailRow } from '@/core/ui/feedback/DetailDialog';
import { CircularLoader } from '@/core/ui/feedback/CircularLoader';
import { formatDateTime } from '@/core/utils/format-date';
import { ReviewStatusBadge } from './ReviewStatusBadge';
import { PART_OF_SPEECH_LABELS } from '../schemas/word.schema';
import { useWordDetailQuery } from '../hooks/use-words';
import type { WordListItem } from '../types/word.types';

/**
 * Detalle de una palabra con sus ejemplos, pronunciaciones y traducciones.
 * El listado no trae esos datos anidados, así que se piden al abrir.
 */
export function WordDetailDialog({
  word,
  onOpenChange,
}: {
  word: WordListItem | null;
  onOpenChange: (open: boolean) => void;
}) {
  const detailQuery = useWordDetailQuery(word?.id ?? null);
  const detail = detailQuery.data;

  return (
    <DetailDialog
      open={Boolean(word)}
      onOpenChange={onOpenChange}
      title={word?.word ?? 'Palabra'}
      description="Detalle de la palabra. Para modificarla usa la acción Editar."
    >
      {detailQuery.isLoading && <CircularLoader label="Cargando palabra…" />}

      {detail && (
        <>
          <DetailRow label="Fonética" value={detail.phonetic} />
          <DetailRow
            label="Tipo gramatical"
            value={detail.partOfSpeech ? PART_OF_SPEECH_LABELS[detail.partOfSpeech] : null}
          />
          <DetailRow label="Revisión" value={<ReviewStatusBadge status={detail.reviewStatus} />} />
          <DetailRow label="Fuente" value={detail.source} />
          <DetailRow label="Definición" value={detail.definitionEn} />
          <DetailRow label="Actualizada" value={formatDateTime(detail.updatedAt)} />

          <div className="space-y-1 pt-1">
            <p className="text-muted-foreground">Traducciones ({detail.translations.length})</p>
            {detail.translations.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin traducciones.</p>
            ) : (
              <ul className="space-y-1">
                {detail.translations.map((translation) => (
                  <li key={translation.id} className="flex items-center gap-2">
                    <span className="text-sm">{translation.translation}</span>
                    <ReviewStatusBadge status={translation.reviewStatus} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {detail.examples.length > 0 && (
            <div className="space-y-1 pt-1">
              <p className="text-muted-foreground">Ejemplos</p>
              <ul className="list-disc space-y-1 pl-4">
                {detail.examples.map((example) => (
                  <li key={example.id} className="text-sm">
                    {example.exampleText}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {detail.pronunciations.length > 0 && (
            <div className="space-y-1 pt-1">
              <p className="text-muted-foreground">Pronunciaciones</p>
              <div className="flex flex-wrap gap-1">
                {detail.pronunciations.map((pronunciation) => (
                  <Badge key={pronunciation.id} variant="outline">
                    {pronunciation.accent ?? 'general'} {pronunciation.phonetic ?? ''}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </DetailDialog>
  );
}
