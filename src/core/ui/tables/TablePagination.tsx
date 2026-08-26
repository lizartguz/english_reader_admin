import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FilterSelect } from '@/core/ui/misc/FilterSelect';
import { PAGE_SIZE_OPTIONS } from '@/core/config/constants';
import type { PaginationMeta } from '@/core/api/api-response';

interface TablePaginationProps {
  meta: PaginationMeta | undefined;
  onPageChange: (page: number) => void;
  /** Si se define, se ofrece cambiar la cantidad de registros por página (doc 02). */
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
}

/** Paginación controlada, consume `meta.pagination` de los listados de la API. */
export function TablePagination({ meta, onPageChange, pageSize, onPageSizeChange }: TablePaginationProps) {
  if (!meta || meta.total === 0) return null;

  const { page, totalPages, total, hasNextPage, hasPreviousPage } = meta;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-muted-foreground">
          Página {page} de {totalPages} · {total} registro{total === 1 ? '' : 's'}
        </p>

        {onPageSizeChange && pageSize !== undefined && (
          <div className="flex items-center gap-2">
            <Label htmlFor="pageSize" className="text-sm text-muted-foreground">
              Por página
            </Label>
            <FilterSelect
              aria-label="Registros por página"
              value={String(pageSize)}
              onValueChange={(value) => onPageSizeChange(Number(value))}
              options={PAGE_SIZE_OPTIONS.map((size) => ({ value: String(size), label: String(size) }))}
              className="w-20"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!hasPreviousPage}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft /> Anterior
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!hasNextPage}
          onClick={() => onPageChange(page + 1)}
        >
          Siguiente <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
