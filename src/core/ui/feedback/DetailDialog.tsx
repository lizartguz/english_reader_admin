import type { ReactNode } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

/** Fila de detalle: etiqueta a la izquierda, valor a la derecha. */
export function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  const isEmpty = value === null || value === undefined || value === '';

  return (
    <div className="grid grid-cols-3 gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="col-span-2 break-words">{isEmpty ? '—' : value}</span>
    </div>
  );
}

interface DetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Diálogo de solo lectura para la acción «Ver» (doc 02).
 *
 * A diferencia de `FormModal` no tiene acciones de guardado: solo presenta el
 * registro. Lo comparten historias, palabras, usuarios, auditoría y logs.
 */
export function DetailDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className = 'sm:max-w-lg',
}: DetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className} data-testid="detail-dialog">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="max-h-[60vh] space-y-3 overflow-y-auto text-sm">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
