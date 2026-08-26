import { Fragment } from 'react';
import type { LucideIcon } from 'lucide-react';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface RowAction {
  key: string;
  label: string;
  icon?: LucideIcon;
  onSelect: () => void;
  destructive?: boolean;
  /** Si es false, la acción no se renderiza (permiso o regla de estado). */
  visible?: boolean;
  disabled?: boolean;
  separatorBefore?: boolean;
}

/**
 * Columna final de acciones de fila (doc 02). Las acciones visibles dependen
 * de permisos y estado del registro; la API vuelve a validar cada una.
 */
export function ActionDropdown({ actions, label }: { actions: RowAction[]; label: string }) {
  const visibleActions = actions.filter((action) => action.visible !== false);

  if (visibleActions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-sm" data-testid="row-actions">
            <MoreHorizontal />
            <span className="sr-only">{label}</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {visibleActions.map((action) => (
          <Fragment key={action.key}>
            {action.separatorBefore && <DropdownMenuSeparator />}
            <DropdownMenuItem
              variant={action.destructive ? 'destructive' : 'default'}
              disabled={action.disabled}
              onClick={action.onSelect}
            >
              {action.icon && <action.icon />}
              {action.label}
            </DropdownMenuItem>
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
