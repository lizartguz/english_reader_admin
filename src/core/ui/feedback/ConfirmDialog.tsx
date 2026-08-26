import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ButtonLoader } from './ButtonLoader';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
}

/**
 * Confirmación reutilizable para acciones destructivas o sensibles (doc
 * 02/11): eliminar, archivar, bloquear, cambiar rol, rechazar traducción.
 * No se cierra automáticamente mientras `loading` es true.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive = false,
  loading = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(next: boolean) => !loading && onOpenChange(next)}>
      <AlertDialogContent data-testid="confirm-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{cancelLabel}</AlertDialogCancel>
          <ButtonLoader
            variant={destructive ? 'destructive' : 'default'}
            loading={loading}
            onClick={onConfirm}
            data-testid="confirm-dialog-accept"
          >
            {confirmLabel}
          </ButtonLoader>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
