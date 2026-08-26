import { Loader2 } from 'lucide-react';
import { Button, type buttonVariants } from '@/components/ui/button';
import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

interface ButtonLoaderProps
  extends ComponentProps<typeof Button>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  loadingText?: string;
}

/** Botón con estado "guardando" reutilizable: spinner + bloqueo mientras carga. */
export function ButtonLoader({
  loading = false,
  loadingText,
  children,
  disabled,
  ...props
}: ButtonLoaderProps) {
  return (
    <Button disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="animate-spin" aria-hidden />}
      {loading ? (loadingText ?? children) : children}
    </Button>
  );
}
