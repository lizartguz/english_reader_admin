import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FilterSelect } from '@/core/ui/misc/FilterSelect';
import { FileUploadField } from '@/core/ui/forms/FileUploadField';
import { CircularLoader } from '@/core/ui/feedback/CircularLoader';
import { EmptyState } from '@/core/ui/feedback/EmptyState';
import { ConfirmDialog } from '@/core/ui/feedback/ConfirmDialog';
import { AppFeedback } from '@/core/ui/feedback/AppFeedback';
import { toFriendlyMessage } from '@/core/errors/friendly-error';
import { AdminMessages, FILE_LIMITS } from '@/core/config/constants';
import { formatFileSize, isWithinMaxSizeMb } from '@/core/utils/file-size';
import { usePermissions } from '@/core/auth/permission-checker';
import { PermissionCode } from '@/core/permissions/permissions.enum';
import { useDeleteStoryAsset, useStoryDetailQuery, useUploadStoryAsset } from '../hooks/use-stories';
import { AssetPreview } from './AssetPreview';
import type { StoryAsset, StoryAssetType, StoryListItem } from '../types/story.types';

interface StoryAssetsModalProps {
  story: StoryListItem | null;
  onOpenChange: (open: boolean) => void;
}

const TYPE_LABELS: Record<StoryAssetType, string> = {
  cover_image: 'Portada',
  audio: 'Audio',
  attachment: 'Adjunto',
};

/** Extensiones aceptadas por el input según el tipo elegido (doc 11). */
const ACCEPT_BY_TYPE: Record<StoryAssetType, string> = {
  cover_image: '.png,.jpg,.jpeg,.webp',
  audio: '.mp3,.m4a',
  attachment: '.pdf',
};

/**
 * Gestiona los recursos de una historia: portada, audio y adjuntos.
 * Valida formato y tamaño antes de enviar; la API vuelve a validarlo.
 */
export function StoryAssetsModal({ story, onOpenChange }: StoryAssetsModalProps) {
  const { hasPermission } = usePermissions();
  const canUpload = hasPermission(PermissionCode.FilesUpload);
  const canDelete = hasPermission(PermissionCode.FilesDelete);

  const [assetType, setAssetType] = useState<StoryAssetType>('cover_image');
  const [deleting, setDeleting] = useState<StoryAsset | null>(null);

  const detailQuery = useStoryDetailQuery(story?.id ?? null);
  const uploadMutation = useUploadStoryAsset();
  const deleteMutation = useDeleteStoryAsset();

  function validateFile(file: File): string | null {
    if (assetType === 'cover_image') {
      if (!FILE_LIMITS.imageAllowedTypes.includes(file.type as never)) {
        return 'El archivo seleccionado no tiene un formato de imagen permitido.';
      }
      if (!isWithinMaxSizeMb(file, FILE_LIMITS.imageMaxSizeMb)) {
        return `La imagen supera el tamaño máximo de ${FILE_LIMITS.imageMaxSizeMb} MB.`;
      }
    }

    if (assetType === 'audio') {
      if (!FILE_LIMITS.audioAllowedTypes.includes(file.type as never)) {
        return 'El archivo seleccionado no tiene un formato de audio permitido.';
      }
      if (!isWithinMaxSizeMb(file, FILE_LIMITS.audioMaxSizeMb)) {
        return `El audio supera el tamaño máximo de ${FILE_LIMITS.audioMaxSizeMb} MB.`;
      }
    }

    if (assetType === 'attachment' && file.type !== 'application/pdf') {
      return 'El adjunto debe ser un archivo PDF.';
    }

    return null;
  }

  function confirmDelete() {
    if (!deleting) return;
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        AppFeedback.success(AdminMessages.DeletedSuccess);
        setDeleting(null);
      },
      onError: (error) => AppFeedback.error({ title: toFriendlyMessage(error) }),
    });
  }

  const assets = detailQuery.data?.assets ?? [];

  return (
    <>
      <Dialog open={Boolean(story)} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Recursos de «{story?.title}»</DialogTitle>
            <DialogDescription>Portada, audio y adjuntos asociados a la historia.</DialogDescription>
          </DialogHeader>

          <div className="max-h-[45vh] space-y-2 overflow-y-auto py-2">
            {detailQuery.isLoading && <CircularLoader />}
            {!detailQuery.isLoading && assets.length === 0 && (
              <EmptyState title="Sin recursos" description="Esta historia aún no tiene archivos cargados." />
            )}
            {assets.map((asset) => {
              return (
                <div key={asset.id} className="flex items-center justify-between gap-3 rounded-md border p-2.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <AssetPreview asset={asset} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {asset.originalFileName ?? TYPE_LABELS[asset.type]}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {TYPE_LABELS[asset.type]} · {asset.mimeType} · {formatFileSize(asset.fileSizeBytes)}
                      </p>
                    </div>
                  </div>
                  {canDelete && (
                    <Button variant="ghost" size="icon-sm" title="Eliminar" onClick={() => setDeleting(asset)}>
                      <Trash2 className="text-destructive" />
                      <span className="sr-only">Eliminar recurso</span>
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          {canUpload && (
            <div className="space-y-3 border-t pt-3">
              <div className="flex flex-wrap items-end gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="assetType">Tipo de recurso</Label>
                  <FilterSelect
                    aria-label="Tipo de recurso"
                    value={assetType}
                    onValueChange={(value) => setAssetType(value as StoryAssetType)}
                    options={[
                      { value: 'cover_image', label: 'Portada' },
                      { value: 'audio', label: 'Audio' },
                      { value: 'attachment', label: 'Adjunto (PDF)' },
                    ]}
                  />
                </div>

                <FileUploadField
                  accept={ACCEPT_BY_TYPE[assetType]}
                  validate={validateFile}
                  uploading={uploadMutation.isPending}
                  onValidationError={(message) => AppFeedback.error({ title: message })}
                  onSelect={(file) => {
                    if (!story) return;
                    uploadMutation.mutate(
                      { storyId: story.id, file, type: assetType },
                      {
                        onSuccess: () => AppFeedback.success('Archivo cargado correctamente.'),
                        onError: (error) => AppFeedback.error({ title: toFriendlyMessage(error) }),
                      },
                    );
                  }}
                  hint={`Imágenes PNG, JPG o WebP hasta ${FILE_LIMITS.imageMaxSizeMb} MB. Audio MP3 o M4A hasta ${FILE_LIMITS.audioMaxSizeMb} MB. Adjuntos en PDF.`}
                />
              </div>
            </div>
          )}

        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="¿Deseas eliminar este recurso?"
        description="El archivo dejará de estar disponible en la aplicación."
        confirmLabel="Eliminar"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />
    </>
  );
}
