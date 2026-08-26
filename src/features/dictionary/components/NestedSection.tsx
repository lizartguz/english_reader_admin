import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MAX_NESTED_ITEMS } from '../schemas/word.schema';

interface NestedSectionProps {
  title: string;
  count: number;
  onAdd: () => void;
  addLabel: string;
  children: ReactNode;
  /** Las secciones opcionales arrancan plegadas para no abrumar el formulario. */
  defaultOpen?: boolean;
}

/**
 * Sección plegable para una colección anidada del formulario de palabra.
 *
 * Muestra el contador «n de 10» porque la API rechaza más de ese límite: es
 * mejor verlo mientras se llena que recibir el error al guardar.
 */
export function NestedSection({
  title,
  count,
  onAdd,
  addLabel,
  children,
  defaultOpen = false,
}: NestedSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const lleno = count >= MAX_NESTED_ITEMS;

  return (
    <section className="space-y-2 border-t pt-3">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex items-center gap-1.5 text-sm font-medium text-foreground"
        >
          {open ? <ChevronDown className="size-4" aria-hidden /> : <ChevronRight className="size-4" aria-hidden />}
          {title}
        </button>
        <span className="text-xs text-muted-foreground">
          {count} de {MAX_NESTED_ITEMS}
        </span>
      </div>

      {open && (
        <div className="space-y-2">
          {children}
          <Button type="button" variant="outline" size="sm" onClick={onAdd} disabled={lleno}>
            <Plus /> {addLabel}
          </Button>
          {lleno && (
            <p className="text-xs text-muted-foreground">
              Se alcanzó el máximo permitido por la API.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
