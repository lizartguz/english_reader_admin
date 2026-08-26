import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterBarProps {
  children: ReactNode;
  onClear?: () => void;
  hasActiveFilters?: boolean;
  actions?: ReactNode;
}

/**
 * Fila superior de filtros + acciones (doc 02). Se reorganiza en columnas en
 * móvil vía flex-wrap; el botón de creación va en `actions`.
 */
export function FilterBar({ children, onClear, hasActiveFilters, actions }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3" data-testid="filter-bar">
      <div className="flex flex-wrap items-end gap-2">
        {children}
        {onClear && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
            disabled={!hasActiveFilters}
            className="text-muted-foreground"
          >
            <X /> Limpiar filtros
          </Button>
        )}
      </div>
      {/* `ml-auto` mantiene las acciones a la derecha incluso cuando los
          filtros se envuelven en varias líneas (doc 02). */}
      {actions && <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
