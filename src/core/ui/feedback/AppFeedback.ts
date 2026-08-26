import { toast } from 'sonner';

interface FeedbackOptions {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

function withOptionalAction(options: FeedbackOptions) {
  return options.actionLabel && options.onAction
    ? { action: { label: options.actionLabel, onClick: options.onAction } }
    : undefined;
}

/**
 * Mensajes centralizados de éxito/error/advertencia/información (doc 03/12).
 * Las confirmaciones destructivas usan `ConfirmDialog`, no toasts.
 */
export const AppFeedback = {
  success(options: FeedbackOptions | string) {
    const opts = typeof options === 'string' ? { title: options } : options;
    toast.success(opts.title, { description: opts.description, ...withOptionalAction(opts) });
  },
  error(options: FeedbackOptions | string) {
    const opts = typeof options === 'string' ? { title: options } : options;
    toast.error(opts.title, { description: opts.description, ...withOptionalAction(opts) });
  },
  warning(options: FeedbackOptions | string) {
    const opts = typeof options === 'string' ? { title: options } : options;
    toast.warning(opts.title, { description: opts.description, ...withOptionalAction(opts) });
  },
  info(options: FeedbackOptions | string) {
    const opts = typeof options === 'string' ? { title: options } : options;
    toast.info(opts.title, { description: opts.description, ...withOptionalAction(opts) });
  },
};
