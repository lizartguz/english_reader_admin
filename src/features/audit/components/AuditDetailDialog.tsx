import { DetailDialog, DetailRow } from '@/core/ui/feedback/DetailDialog';
import { formatDateTime } from '@/core/utils/format-date';
import type { AuditLog } from '../types/audit-log.types';

/** Detalle de solo lectura de un evento de auditoría. No permite editar ni eliminar. */
export function AuditDetailDialog({
  log,
  onOpenChange,
}: {
  log: AuditLog | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <DetailDialog open={Boolean(log)} onOpenChange={onOpenChange} title="Detalle del evento">
      {log && (
        <>
          <DetailRow label="Fecha" value={formatDateTime(log.createdAt)} />
          <DetailRow label="Actor" value={log.actor ? `${log.actor.fullName} (${log.actor.email})` : 'Sistema'} />
          <DetailRow label="Acción" value={log.action} />
          <DetailRow label="Entidad" value={log.entityType} />
          <DetailRow label="ID de entidad" value={log.entityId} />
          <DetailRow label="Resumen" value={log.summary} />
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
