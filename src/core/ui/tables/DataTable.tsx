import type { ReactNode } from 'react';
import { flexRender } from '@tanstack/react-table';
import { type LegacyColumnDef, getCoreRowModel, useLegacyTable } from '@tanstack/react-table/legacy';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FullBlockLoader } from '@/core/ui/feedback/CircularLoader';
import { ErrorState } from '@/core/ui/feedback/ErrorState';
import { EmptyState } from '@/core/ui/feedback/EmptyState';
import { cn } from '@/lib/utils';

export type { LegacyColumnDef as ColumnDef } from '@tanstack/react-table/legacy';

/**
 * Restricción de TanStack Table v9 para filas (espejo de su tipo interno
 * `RowData`). Debe ser `any`, no `unknown`: con `unknown` TypeScript exige un
 * índice de firma explícito y ninguna interfaz de dominio lo cumple.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RowShape = Record<string, any>;

interface DataTableProps<TData extends RowShape> {
  columns: LegacyColumnDef<TData>[];
  data: TData[];
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
  onRetry?: () => void;
  emptyState?: ReactNode;
  getRowId?: (row: TData) => string;
  /** Si se define, cada fila se vuelve clicable (ej. abrir un detalle o modal). */
  onRowClick?: (row: TData) => void;
  /**
   * Ordenamiento del lado del servidor (doc 02). Se declara qué columnas lo
   * admiten porque la API valida `sort` contra una lista permitida: ofrecerlo
   * en una columna no soportada devolvería un error.
   */
  sorting?: {
    /** `id` de las columnas ordenables. */
    sortableColumns: string[];
    field?: string;
    order?: 'asc' | 'desc';
    onSortChange: (field: string, order: 'asc' | 'desc') => void;
  };
}

/**
 * Tabla administrativa headless sobre TanStack Table v9 (doc 02/07/08), usando
 * la capa de compatibilidad `/legacy` (API v8) porque no necesitamos las
 * features nuevas de ordenamiento/filtrado en cliente: todo eso es servidor.
 * Estados de carga, vacío y error centralizados; columna de acciones definida
 * por cada feature en su propio archivo de columnas.
 */
export function DataTable<TData extends RowShape>({
  columns,
  data,
  isLoading,
  isError,
  error,
  onRetry,
  emptyState,
  getRowId,
  onRowClick,
  sorting,
}: DataTableProps<TData>) {
  const table = useLegacyTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
  });

  if (isLoading) {
    return (
      <div className="rounded-md border" data-testid="data-table-loading">
        <FullBlockLoader label="Cargando registros…" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md border" data-testid="data-table-error">
        <ErrorState error={error} onRetry={onRetry} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-md border" data-testid="data-table-empty">
        {emptyState ?? <EmptyState />}
      </div>
    );
  }

  return (
    <div className="rounded-md border" data-testid="data-table">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const contenido = header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext());

                const esOrdenable = sorting?.sortableColumns.includes(header.column.id) ?? false;

                if (!esOrdenable) {
                  return <TableHead key={header.id}>{contenido}</TableHead>;
                }

                const activa = sorting?.field === header.column.id;
                const siguiente = activa && sorting?.order === 'asc' ? 'desc' : 'asc';
                const Icono = !activa ? ChevronsUpDown : sorting?.order === 'asc' ? ArrowUp : ArrowDown;

                return (
                  <TableHead key={header.id} aria-sort={activa ? (sorting?.order === 'asc' ? 'ascending' : 'descending') : 'none'}>
                    <button
                      type="button"
                      className="-mx-1 inline-flex items-center gap-1 rounded px-1 hover:text-foreground"
                      onClick={() => sorting?.onSortChange(header.column.id, siguiente)}
                    >
                      {contenido}
                      <Icono className={cn('size-3.5', activa ? 'text-foreground' : 'text-muted-foreground/60')} aria-hidden />
                    </button>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-testid="data-table-row"
              // Una fila clicable debe ser alcanzable con el tabulador y
              // activable con Enter o Espacio: si no, la acción que abre queda
              // fuera del alcance de quien navega sin ratón.
              tabIndex={onRowClick ? 0 : undefined}
              role={onRowClick ? 'button' : undefined}
              onClick={onRowClick ? () => onRowClick(row.original) : undefined}
              onKeyDown={
                onRowClick
                  ? (event) => {
                      if (event.key !== 'Enter' && event.key !== ' ') return;
                      // El objetivo debe ser la fila misma: dentro puede haber
                      // botones con su propia activación por teclado.
                      if (event.target !== event.currentTarget) return;
                      event.preventDefault();
                      onRowClick(row.original);
                    }
                  : undefined
              }
              className={cn(
                onRowClick &&
                  'cursor-pointer focus-visible:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
              )}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
