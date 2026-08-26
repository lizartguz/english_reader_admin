import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusTone = 'success' | 'warning' | 'neutral' | 'destructive' | 'info';

const toneClasses: Record<StatusTone, string> = {
  success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  neutral: 'bg-muted text-muted-foreground',
  destructive: 'bg-destructive/10 text-destructive',
  info: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
};

/** Badge de estado consistente en todas las tablas administrativas. */
export function StatusBadge({ label, tone }: { label: string; tone: StatusTone }) {
  return (
    <Badge variant="outline" className={cn('border-transparent font-medium', toneClasses[tone])}>
      {label}
    </Badge>
  );
}
