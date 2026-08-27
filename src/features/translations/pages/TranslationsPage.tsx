import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/core/ui/layout/PageHeader';
import { FilterBar } from '@/core/ui/misc/FilterBar';
import { FilterSelect } from '@/core/ui/misc/FilterSelect';
import { DataTable } from '@/core/ui/tables/DataTable';
import { TablePagination } from '@/core/ui/tables/TablePagination';
import { ConfirmDialog } from '@/core/ui/feedback/ConfirmDialog';
import { EmptyState } from '@/core/ui/feedback/EmptyState';
import { AppFeedback } from '@/core/ui/feedback/AppFeedback';
import { toFriendlyMessage } from '@/core/errors/friendly-error';
import { AdminMessages, DEFAULT_PAGE_SIZE, TARGET_LANGUAGES } from '@/core/config/constants';
import { usePermissions } from '@/core/auth/permission-checker';
import { PermissionCode } from '@/core/permissions/permissions.enum';
import { useDebouncedValue } from '@/core/hooks/use-debounced-value';
import { useDeleteTranslationGlobal, useReviewTranslationGlobal, useTranslationsQuery } from '../hooks/use-translations';
import { getTranslationColumns } from '../components/translations-columns';
import { ReviewTranslationModal } from '../components/ReviewTranslationModal';
import type { ReviewStatus, TranslationFilters, TranslationListItem } from '../types/translation.types';

type ReviewFilter = 'all' | ReviewStatus;

/**
 * Revisión de traducciones (doc 10).
 *
 * Las traducciones las genera automáticamente el proveedor externo cuando un
 * lector consulta una palabra nueva, y nacen pendientes. Esta pantalla existe
 * para responder «qué hay por revisar» sin tener que abrir palabra por palabra.
 */
export function TranslationsPage() {
  const { hasPermission } = usePermissions();
  const canUpdate = hasPermission(PermissionCode.TranslationsUpdate);
  const canReview = hasPermission(PermissionCode.TranslationsReview);
  const canDelete = hasPermission(PermissionCode.TranslationsDelete);

  const [word, setWord] = useState('');
  const wordDiferido = useDebouncedValue(word);
  const [reviewStatus, setReviewStatus] = useState<ReviewFilter>('all');
  const [targetLanguage, setTargetLanguage] = useState('all');
  const [source, setSource] = useState('');
  const sourceDiferido = useDebouncedValue(source);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [sort, setSort] = useState('updatedAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const [reviewing, setReviewing] = useState<TranslationListItem | null>(null);
  const [deleting, setDeleting] = useState<TranslationListItem | null>(null);

  const filters: TranslationFilters = useMemo(
    () => ({
      word: wordDiferido || undefined,
      reviewStatus: reviewStatus === 'all' ? undefined : reviewStatus,
      targetLanguage: targetLanguage === 'all' ? undefined : targetLanguage,
      source: sourceDiferido || undefined,
      page,
      limit: pageSize,
      sort,
      order,
    }),
    [wordDiferido, reviewStatus, targetLanguage, sourceDiferido, page, pageSize, sort, order],
  );

  const query = useTranslationsQuery(filters);
  const reviewMutation = useReviewTranslationGlobal();
  const deleteMutation = useDeleteTranslationGlobal();

  const hasActiveFilters =
    Boolean(word) || reviewStatus !== 'all' || targetLanguage !== 'all' || Boolean(source);

  function clearFilters() {
    setWord('');
    setReviewStatus('all');
    setTargetLanguage('all');
    setSource('');
    setPage(1);
  }

  function changeStatus(translation: TranslationListItem, status: 'reviewed' | 'rejected') {
    reviewMutation.mutate(
      { id: translation.id, reviewStatus: status },
      {
        onSuccess: () =>
          AppFeedback.success(
            status === 'reviewed' ? 'Traducción aprobada correctamente.' : 'Traducción rechazada correctamente.',
          ),
        onError: (error) => AppFeedback.error({ title: toFriendlyMessage(error) }),
      },
    );
  }

  function confirmDelete() {
    if (!deleting) return;
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        AppFeedback.success(AdminMessages.DeletedSuccess);
        setDeleting(null);
      },
      onError: (error) => AppFeedback.error({ title: toFriendlyMessage(error) }),
    });
  }

  const columns = getTranslationColumns({
    canUpdate,
    canReview,
    canDelete,
    onReview: setReviewing,
    onChangeStatus: changeStatus,
    onDelete: setDeleting,
  });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Traducciones"
        description="Revisa las traducciones generadas automáticamente al consultar palabras desde la aplicación."
      />

      <FilterBar onClear={clearFilters} hasActiveFilters={hasActiveFilters}>
        <div className="relative w-56">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            placeholder="Buscar palabra…"
            className="pl-8"
            value={word}
            onChange={(event) => {
              setPage(1);
              setWord(event.target.value);
            }}
          />
        </div>
        <FilterSelect
          aria-label="Filtrar por estado de revisión"
          value={reviewStatus}
          onValueChange={(value) => {
            setPage(1);
            setReviewStatus(value as ReviewFilter);
          }}
          options={[
            { value: 'all', label: 'Toda revisión' },
            { value: 'pending', label: 'Pendientes' },
            { value: 'reviewed', label: 'Revisadas' },
            { value: 'rejected', label: 'Rechazadas' },
          ]}
        />
        <FilterSelect
          aria-label="Filtrar por idioma destino"
          value={targetLanguage}
          onValueChange={(value) => {
            setPage(1);
            setTargetLanguage(value);
          }}
          options={[
            { value: 'all', label: 'Todos los idiomas' },
            ...TARGET_LANGUAGES.map((lang) => ({ value: lang.code, label: lang.label })),
          ]}
          className="w-40"
        />
        <Input
          placeholder="Fuente (ej. libretranslate)"
          className="w-52"
          aria-label="Filtrar por fuente"
          value={source}
          onChange={(event) => {
            setPage(1);
            setSource(event.target.value);
          }}
        />
      </FilterBar>

      <DataTable
        columns={columns}
        data={query.data?.items ?? []}
        isLoading={query.isLoading}
        isError={query.isError}
        error={query.error}
        onRetry={() => query.refetch()}
        getRowId={(row) => row.id}
        emptyState={
          <EmptyState
            title="Sin traducciones"
            description="No se encontraron traducciones con los filtros actuales."
          />
        }
        sorting={{
          sortableColumns: ['reviewStatus', 'updatedAt'],
          field: sort,
          order,
          onSortChange: (field, nextOrder) => {
            setPage(1);
            setSort(field);
            setOrder(nextOrder);
          },
        }}
      />

      <TablePagination
        meta={query.data?.meta}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPage(1);
          setPageSize(size);
        }}
      />

      <ReviewTranslationModal
        key={reviewing?.id}
        translation={reviewing}
        onOpenChange={(open) => !open && setReviewing(null)}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="¿Deseas eliminar esta traducción?"
        description="Dejará de mostrarse en la aplicación móvil."
        confirmLabel="Eliminar"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
