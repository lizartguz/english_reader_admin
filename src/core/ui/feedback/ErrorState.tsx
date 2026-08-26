import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toFriendlyMessage } from '@/core/errors/friendly-error';

interface ErrorStateProps {
  error?: unknown;
  onRetry?: () => void;
}

/** Estado de error amigable para tablas y páginas. Nunca muestra detalle técnico. */
export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <AlertTriangle className="size-10 text-destructive/70" aria-hidden />
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">No se pudo cargar la información</p>
        <p className="text-sm text-muted-foreground">{toFriendlyMessage(error)}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}
