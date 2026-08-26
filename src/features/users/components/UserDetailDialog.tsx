import { Badge } from '@/components/ui/badge';
import { DetailDialog, DetailRow } from '@/core/ui/feedback/DetailDialog';
import { StatusBadge, type StatusTone } from '@/core/ui/misc/StatusBadge';
import { formatDateTime } from '@/core/utils/format-date';
import type { AdminUser, UserStatus } from '../types/user.types';

const STATUS_LABELS: Record<UserStatus, string> = {
  active: 'Activo',
  inactive: 'Inactivo',
  blocked: 'Bloqueado',
  pending_verification: 'Pendiente de verificación',
};

const STATUS_TONES: Record<UserStatus, StatusTone> = {
  active: 'success',
  inactive: 'neutral',
  blocked: 'destructive',
  pending_verification: 'warning',
};

/** Detalle de solo lectura de una cuenta, incluidos sus permisos efectivos. */
export function UserDetailDialog({
  user,
  onOpenChange,
}: {
  user: AdminUser | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <DetailDialog
      open={Boolean(user)}
      onOpenChange={onOpenChange}
      title={user?.fullName ?? 'Usuario'}
      description="Detalle de la cuenta. Para modificarla usa la acción Editar."
    >
      {user && (
        <>
          <DetailRow label="Correo" value={user.email} />
          <DetailRow label="Teléfono" value={user.phoneNumber} />
          <DetailRow
            label="Estado"
            value={<StatusBadge label={STATUS_LABELS[user.status]} tone={STATUS_TONES[user.status]} />}
          />
          <DetailRow
            label="Roles"
            value={
              <span className="flex flex-wrap gap-1">
                {user.roles.map((role) => (
                  <Badge key={role} variant="secondary">
                    {role}
                  </Badge>
                ))}
              </span>
            }
          />
          <DetailRow label="Correo verificado" value={formatDateTime(user.emailVerifiedAt)} />
          <DetailRow label="Último acceso" value={formatDateTime(user.lastLoginAt)} />
          <DetailRow label="Alta" value={formatDateTime(user.createdAt)} />

          <div className="space-y-1 pt-1">
            <p className="text-muted-foreground">Permisos efectivos ({user.permissions.length})</p>
            <div className="flex max-h-40 flex-wrap gap-1 overflow-y-auto rounded-md bg-muted p-2">
              {user.permissions.map((permission) => (
                <Badge key={permission} variant="outline" className="font-mono text-xs">
                  {permission}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}
    </DetailDialog>
  );
}
