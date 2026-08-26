import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { ButtonLoader } from '@/core/ui/feedback/ButtonLoader';

interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  saving?: boolean;
  generalError?: string | null;
  children: ReactNode;
  className?: string;
  saveLabel?: string;
}

/**
 * Modal de creación/edición estándar (doc 02/11). Crear y editar siempre se
 * hace en modal, nunca en pantallas separadas. No se cierra si hay error de
 * validación; muestra estado "guardando" en el botón principal.
 */
export function FormModal({
  open,
  onOpenChange,
  title,
  description,
  onSubmit,
  saving = false,
  generalError,
  children,
  className,
  saveLabel = 'Guardar',
}: FormModalProps) {
  return (
    <Dialog open={open} onOpenChange={(next: boolean) => !saving && onOpenChange(next)}>
      <DialogContent className={cn('sm:max-w-lg', className)} data-testid="form-modal">
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>

          <div className="max-h-[60vh] space-y-4 overflow-y-auto py-4">
            {children}
            {generalError && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                {generalError}
              </p>
            )}
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" disabled={saving} />}>
              Cancelar
            </DialogClose>
            <ButtonLoader type="submit" loading={saving} loadingText="Guardando…" data-testid="form-modal-save">
              {saveLabel}
            </ButtonLoader>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
