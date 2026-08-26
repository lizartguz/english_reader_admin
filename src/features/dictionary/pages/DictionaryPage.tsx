import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/core/ui/layout/PageHeader';
import { FilterBar } from '@/core/ui/misc/FilterBar';
import { FilterSelect } from '@/core/ui/misc/FilterSelect';
import { PermissionGate } from '@/core/ui/misc/PermissionGate';
import { DataTable } from '@/core/ui/tables/DataTable';
import { TablePagination } from '@/core/ui/tables/TablePagination';
import { ConfirmDialog } from '@/core/ui/feedback/ConfirmDialog';
import { EmptyState } from '@/core/ui/feedback/EmptyState';
import { AppFeedback } from '@/core/ui/feedback/AppFeedback';
import { toFriendlyMessage } from '@/core/errors/friendly-error';
import { AdminMessages, DEFAULT_PAGE_SIZE } from '@/core/config/constants';
import { usePermissions } from '@/core/auth/permission-checker';
import { PermissionCode } from '@/core/permissions/permissions.enum';
import { useDeleteWord, useReviewWord, useWordsQuery } from '../hooks/use-words';
import { getWordColumns } from '../components/words-columns';
import { WordFormModal } from '../components/WordFormModal';
import { WordTranslationsModal } from '../components/WordTranslationsModal';
import { WordDetailDialog } from '../components/WordDetailDialog';
import { PART_OF_SPEECH_LABELS, PART_OF_SPEECH_VALUES } from '../schemas/word.schema';
import type { PartOfSpeech, ReviewStatus, WordFilters, WordListItem } from '../types/word.types';

type ReviewFilter = 'all' | ReviewStatus;
type PartOfSpeechFilter = 'all' | PartOfSpeech;

export function DictionaryPage() {
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission(PermissionCode.WordsCreate);
  const canUpdate = hasPermission(PermissionCode.WordsUpdate);
  const canReview = hasPermission(PermissionCode.WordsReview);
  const canDelete = hasPermission(PermissionCode.WordsDelete);
  const canReadTranslations = hasPermission(PermissionCode.TranslationsRead);

  const [search, setSearch] = useState('');
  const [reviewStatus, setReviewStatus] = useState<ReviewFilter>('all');
  const [partOfSpeech, setPartOfSpeech] = useState<PartOfSpeechFilter>('all');
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<WordListItem | null>(null);
  const [viewingWord, setViewingWord] = useState<WordListItem | null>(null);
  const [translationsWord, setTranslationsWord] = useState<WordListItem | null>(null);
  const [deletingWord, setDeletingWord] = useState<WordListItem | null>(null);

  const filters: WordFilters = useMemo(
    () => ({
      search: search || undefined,
      reviewStatus: reviewStatus === 'all' ? undefined : reviewStatus,
      partOfSpeech: partOfSpeech === 'all' ? undefined : partOfSpeech,
      page,
      limit: DEFAULT_PAGE_SIZE,
    }),
    [search, reviewStatus, partOfSpeech, page],
  );

  const query = useWordsQuery(filters);
  const reviewMutation = useReviewWord();
  const deleteMutation = useDeleteWord();

  const hasActiveFilters = Boolean(search) || reviewStatus !== 'all' || partOfSpeech !== 'all';

  function clearFilters() {
    setSearch('');
    setReviewStatus('all');
    setPartOfSpeech('all');
    setPage(1);
  }

  function openCreateModal() {
    setEditingWord(null);
    setFormOpen(true);
  }

  function review(word: WordListItem, status: ReviewStatus) {
    reviewMutation.mutate(
      { id: word.id, reviewStatus: status },
      {
        onSuccess: () => AppFeedback.success(AdminMessages.UpdatedSuccess),
        onError: (error) => AppFeedback.error({ title: toFriendlyMessage(error) }),
      },
    );
  }

  function confirmDelete() {
    if (!deletingWord) return;
    deleteMutation.mutate(deletingWord.id, {
      onSuccess: () => {
        AppFeedback.success(AdminMessages.DeletedSuccess);
        setDeletingWord(null);
      },
      onError: (error) => AppFeedback.error({ title: toFriendlyMessage(error) }),
    });
  }

  const columns = getWordColumns({
    canUpdate,
    onView: setViewingWord,
    canReview,
    canDelete,
    canReadTranslations,
    onEdit: (word) => {
      setEditingWord(word);
      setFormOpen(true);
    },
    onReview: review,
    onTranslations: setTranslationsWord,
    onDelete: setDeletingWord,
  });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Palabras"
        description="Diccionario consultado por la aplicación. Revisa y corrige los datos de proveedores externos."
      />

      <FilterBar
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
        actions={
          <PermissionGate permission={PermissionCode.WordsCreate}>
            <Button onClick={openCreateModal} className="bg-emerald-600 text-white hover:bg-emerald-600/90">
              <Plus /> Crear palabra
            </Button>
          </PermissionGate>
        }
      >
        <div className="relative w-60">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            placeholder="Buscar palabra o definición…"
            className="pl-8"
            value={search}
            onChange={(event) => {
              setPage(1);
              setSearch(event.target.value);
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
          aria-label="Filtrar por tipo gramatical"
          value={partOfSpeech}
          onValueChange={(value) => {
            setPage(1);
            setPartOfSpeech(value as PartOfSpeechFilter);
          }}
          options={[
            { value: 'all', label: 'Todo tipo' },
            ...PART_OF_SPEECH_VALUES.map((value) => ({ value, label: PART_OF_SPEECH_LABELS[value] })),
          ]}
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
        emptyState={<EmptyState title="Sin palabras" description="No se encontraron palabras con los filtros actuales." />}
      />

      <TablePagination meta={query.data?.meta} onPageChange={setPage} />

      {(canCreate || canUpdate) && (
        <WordFormModal
          key={formOpen ? (editingWord?.id ?? 'create') : 'closed'}
          open={formOpen}
          onOpenChange={setFormOpen}
          word={editingWord}
        />
      )}

      <WordDetailDialog
        key={viewingWord?.id}
        word={viewingWord}
        onOpenChange={(open) => !open && setViewingWord(null)}
      />

      <WordTranslationsModal
        key={translationsWord?.id}
        word={translationsWord}
        onOpenChange={(open) => !open && setTranslationsWord(null)}
      />

      <ConfirmDialog
        open={Boolean(deletingWord)}
        onOpenChange={(open) => !open && setDeletingWord(null)}
        title="¿Deseas eliminar esta palabra?"
        description="Dejará de estar disponible en la aplicación junto con sus traducciones."
        confirmLabel="Eliminar"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
