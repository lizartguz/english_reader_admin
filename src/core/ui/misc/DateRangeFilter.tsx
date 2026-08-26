import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DateRangeFilterProps {
  /** Prefijo para los `id` de los campos; debe ser único dentro de la página. */
  idPrefix: string;
  fromLabel?: string;
  toLabel?: string;
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
}

/**
 * Rango de fechas para los filtros de tabla (doc 10).
 *
 * Los `min`/`max` cruzados impiden elegir un rango invertido, que la API
 * aceptaría pero devolvería siempre vacío sin explicar por qué.
 */
export function DateRangeFilter({
  idPrefix,
  fromLabel = 'Desde',
  toLabel = 'Hasta',
  from,
  to,
  onFromChange,
  onToChange,
}: DateRangeFilterProps) {
  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}From`} className="text-xs text-muted-foreground">
          {fromLabel}
        </Label>
        <Input
          id={`${idPrefix}From`}
          type="date"
          className="w-40"
          value={from}
          max={to || undefined}
          onChange={(event) => onFromChange(event.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}To`} className="text-xs text-muted-foreground">
          {toLabel}
        </Label>
        <Input
          id={`${idPrefix}To`}
          type="date"
          className="w-40"
          value={to}
          min={from || undefined}
          onChange={(event) => onToChange(event.target.value)}
        />
      </div>
    </>
  );
}
