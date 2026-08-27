import { Link } from 'react-router';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminRoutes } from '@/core/config/constants';

/**
 * Página inexistente.
 *
 * Antes cualquier ruta desconocida redirigía al dashboard sin decir nada, así
 * que un enlace roto o una dirección mal escrita se veían igual que una
 * navegación normal y no había forma de notar el error.
 */
export function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <FileQuestion className="size-7 text-muted-foreground" aria-hidden />
      </div>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-foreground" data-testid="not-found-title">
          Página no encontrada
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          La dirección que abriste no existe o cambió de lugar. Revisa el enlace o vuelve al inicio.
        </p>
      </div>
      <Button render={<Link to={AdminRoutes.Dashboard} />}>Ir al dashboard</Button>
    </div>
  );
}
