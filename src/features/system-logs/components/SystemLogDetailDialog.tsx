import { DetailDialog, DetailRow } from '@/core/ui/feedback/DetailDialog';
import { StatusBadge, type StatusTone } from '@/core/ui/misc/StatusBadge';
import { formatDateTime } from '@/core/utils/format-date';
import type { SystemLog, SystemLogLevel } from '../types/system-log.types';

const LEVEL_LABELS: Record<SystemLogLevel, string> = {
  info: 'Info',
  warning: 'Advertencia',
  error: 'Error',
  critical: 'Crítico',
};

const LEVEL_TONES: Record<SystemLogLevel, StatusTone> = {
  info: 'info',
  warning: 'warning',
  error: 'destructive',
  critical: 'destructive',
};

/** Detalle de solo lectura de un registro técnico (doc 10). Sin edición. */
export function SystemLogDetailDialog({
  log,
  onOpenChange,
}: {
  log: SystemLog | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <DetailDialog open={Boolean(log)} onOpenChange={onOpenChange} title="Detalle del registro">
      {log && (
        <>
          <DetailRow label="Fecha" value={formatDateTime(log.createdAt)} />
          <DetailRow
            label="Nivel"
            value={<StatusBadge label={LEVEL_LABELS[log.level]} tone={LEVEL_TONES[log.level]} />}
          />
          <DetailRow label="Fuente" value={log.source} />
          <DetailRow label="Mensaje" value={log.message} />
          <DetailRow label="Excepción" value={log.exceptionName} />
          <DetailRow label="Código de error" value={log.errorCode} />
          <DetailRow label="Método" value={log.requestMethod} />
          <DetailRow label="Ruta" value={log.requestPath} />
          <DetailRow label="Dirección IP" value={log.ipAddress} />
          {log.metadata !== null && log.metadata !== undefined && (
            <div className="space-y-1">
              <p className="text-muted-foreground">Metadatos</p>
              <pre className="max-h-40 overflow-auto rounded-md bg-muted p-2 text-xs">
                {JSON.stringify(log.metadata, null, 2)}
              </pre>
            </div>
          )}
        </>
      )}
    </DetailDialog>
  );
}
