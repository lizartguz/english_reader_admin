import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ButtonLoader } from '@/core/ui/feedback/ButtonLoader';
import { AppFeedback } from '@/core/ui/feedback/AppFeedback';
import { toFriendlyMessage } from '@/core/errors/friendly-error';
import { RoleCode } from '@/core/permissions/roles.enum';
import { useAssignUserRoles } from '../hooks/use-user-mutations';
import type { AdminUser } from '../types/user.types';

const ROLE_LABELS: Record<RoleCode, string> = {
  [RoleCode.SuperAdmin]: 'Super administrador',
  [RoleCode.Admin]: 'Administrador',
  [RoleCode.Client]: 'Cliente',
};

interface UserRolesModalProps {
  user: AdminUser | null;
  onOpenChange: (open: boolean) => void;
  /** Roles ofrecidos según la pantalla (clientes vs. administradores). */
  availableRoles: RoleCode[];
}

/** Reemplaza por completo los roles de un usuario (`PATCH /admin/users/:id/roles`). */
export function UserRolesModal({ user, onOpenChange, availableRoles }: UserRolesModalProps) {
  const assignMutation = useAssignUserRoles();
  const [selected, setSelected] = useState<Set<string>>(() => new Set(user?.roles ?? []));

  function toggle(code: RoleCode) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }

  function handleSave() {
    if (!user) return;

    if (selected.size === 0) {
      AppFeedback.error({ title: 'Debes asignar al menos un rol al usuario.' });
      return;
    }

    assignMutation.mutate(
      { id: user.id, roleCodes: Array.from(selected) as RoleCode[] },
      {
        onSuccess: () => {
          AppFeedback.success('Roles actualizados correctamente.');
          onOpenChange(false);
        },
        onError: (error) => AppFeedback.error({ title: toFriendlyMessage(error) }),
      },
    );
  }

  return (
    <Dialog open={Boolean(user)} onOpenChange={(next) => !assignMutation.isPending && onOpenChange(next)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Roles de {user?.fullName}</DialogTitle>
          <DialogDescription>Marca los roles que debe tener este usuario.</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          {availableRoles.map((role) => (
            <Label
              key={role}
              className="flex items-center gap-2 rounded-md border border-transparent p-1.5 font-normal hover:border-border"
            >
              <Checkbox checked={selected.has(role)} onCheckedChange={() => toggle(role)} />
              <span>
                <span className="block text-sm text-foreground">{ROLE_LABELS[role]}</span>
                <span className="block text-xs text-muted-foreground">{role}</span>
              </span>
            </Label>
          ))}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" disabled={assignMutation.isPending} onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <ButtonLoader onClick={handleSave} loading={assignMutation.isPending} loadingText="Guardando…">
            Guardar
          </ButtonLoader>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
