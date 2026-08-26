import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CircularLoaderProps {
  /** Texto accesible para lectores de pantalla cuando la espera es perceptible. */
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-10',
} as const;

/** Indicador de carga circular reutilizable (doc 03/13). */
export function CircularLoader({ label = 'Cargando…', className, size = 'md' }: CircularLoaderProps) {
  return (
    <div role="status" className={cn('flex items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-muted-foreground', sizeClasses[size])} aria-hidden />
      <span className="sr-only">{label}</span>
    </div>
  );
}

/** Bloque de carga a pantalla/panel completo, con texto visible. */
export function FullBlockLoader({ label = 'Cargando…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-sm text-muted-foreground">
      <Loader2 className="size-8 animate-spin" aria-hidden />
      <span>{label}</span>
    </div>
  );
}
