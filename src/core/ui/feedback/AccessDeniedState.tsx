import { ShieldAlert } from 'lucide-react';
import { AdminMessages } from '@/core/config/constants';

/**
 * Vista de acceso denegado. Nunca debe revelar guards, endpoints o
 * estructura interna de permisos (doc 04/13).
 */
export function AccessDeniedState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-center">
      <ShieldAlert className="size-12 text-muted-foreground/60" aria-hidden />
      <div className="space-y-1">
        <p className="text-base font-medium text-foreground">{AdminMessages.AccessDeniedTitle}</p>
        <p className="text-sm text-muted-foreground">{AdminMessages.AccessDeniedDescription}</p>
      </div>
    </div>
  );
}
