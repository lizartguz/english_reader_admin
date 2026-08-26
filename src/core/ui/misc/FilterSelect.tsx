import { useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: FilterOption[];
  placeholder?: string;
  className?: string;
  'aria-label'?: string;
}

/**
 * Select de filtro reutilizable para las tablas administrativas.
 *
 * Base UI necesita el mapa `items` en la raíz para que el disparador muestre
 * la etiqueta y no el valor crudo; encapsularlo aquí evita repetirlo (y
 * olvidarlo) en cada pantalla.
 */
export function FilterSelect({
  value,
  onValueChange,
  options,
  placeholder,
  className,
  'aria-label': ariaLabel,
}: FilterSelectProps) {
  const items = useMemo(
    () => Object.fromEntries(options.map((option) => [option.value, option.label])),
    [options],
  );

  return (
    <Select
      items={items}
      value={value}
      onValueChange={(next) => {
        if (next !== null) onValueChange(String(next));
      }}
    >
      <SelectTrigger className={cn('w-44', className)} aria-label={ariaLabel}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
