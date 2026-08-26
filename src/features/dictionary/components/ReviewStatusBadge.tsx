import { StatusBadge, type StatusTone } from '@/core/ui/misc/StatusBadge';
import type { ReviewStatus } from '../types/word.types';

const REVIEW_LABELS: Record<ReviewStatus, string> = {
  pending: 'Pendiente',
  reviewed: 'Revisada',
  rejected: 'Rechazada',
};

const REVIEW_TONES: Record<ReviewStatus, StatusTone> = {
  pending: 'warning',
  reviewed: 'success',
  rejected: 'destructive',
};

/** Badge de estado de revisión, compartido por palabras y traducciones. */
export function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  return <StatusBadge label={REVIEW_LABELS[status]} tone={REVIEW_TONES[status]} />;
}
