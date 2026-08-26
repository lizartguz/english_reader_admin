import { useEffect, useState } from 'react';
import { FileAudio, FileText, Image as ImageIcon } from 'lucide-react';
import { CircularLoader } from '@/core/ui/feedback/CircularLoader';
import { storiesApi } from '../api/stories.api';
import type { StoryAsset } from '../types/story.types';

const FALLBACK_ICONS = {
  cover_image: ImageIcon,
  audio: FileAudio,
  attachment: FileText,
} as const;

/**
 * Vista previa de un recurso protegido (doc 02).
 *
 * El endpoint exige cabecera de autorización, así que no se puede apuntar un
 * `<img src>` directamente a él: se descarga como blob y se expone mediante
 * una URL de objeto temporal, que se libera al desmontar para no filtrar
 * memoria. Solo se previsualizan imágenes; audio y adjuntos muestran su icono.
 */
export function AssetPreview({ asset }: { asset: StoryAsset }) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const isImage = asset.type === 'cover_image';

  useEffect(() => {
    if (!isImage) return;

    let revoked = false;
    let created: string | null = null;

    storiesApi
      .fetchAssetBlob(asset.id)
      .then((url) => {
        created = url;
        // Si el componente ya se desmontó, se libera de inmediato.
        if (revoked) URL.revokeObjectURL(url);
        else setObjectUrl(url);
      })
      .catch(() => setFailed(true));

    return () => {
      revoked = true;
      if (created) URL.revokeObjectURL(created);
    };
  }, [asset.id, isImage]);

  const Icon = FALLBACK_ICONS[asset.type];

  if (!isImage || failed) {
    return (
      <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="size-5 text-muted-foreground" aria-hidden />
      </div>
    );
  }

  if (!objectUrl) {
    return (
      <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted">
        <CircularLoader size="sm" label="Cargando vista previa…" />
      </div>
    );
  }

  return (
    <img
      src={objectUrl}
      alt={asset.originalFileName ?? 'Portada de la historia'}
      className="size-12 shrink-0 rounded-md object-cover"
    />
  );
}
