import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ButtonLoader } from '@/core/ui/feedback/ButtonLoader';
import { AppFeedback } from '@/core/ui/feedback/AppFeedback';
import { toFriendlyMessage } from '@/core/errors/friendly-error';
import { usePermissionsQuery } from '@/features/permissions/hooks/use-permissions-query';
import type { Permission } from '@/features/permissions/types/permission.types';
import { useUpdateRolePermissions } from '../hooks/use-update-role-permissions';
import type { Role } from '../types/role.types';

interface RolePermissionsModalProps {
  role: Role | null;
  onOpenChange: (open: boolean) => void;
}

/**
 * Asigna o quita permisos de un rol existente (doc: gestión pedida por el
 * usuario). No crea, renombra ni elimina roles — eso se hace en código.
 */
export function RolePermissionsModal({ role, onOpenChange }: RolePermissionsModalProps) {
  const permissionsQuery = usePermissionsQuery();
  const updateMutation = useUpdateRolePermissions();
  const [selected, setSelected] = useState<Set<string>>(() => new Set(role?.permissions ?? []));

  const groups = useMemo(() => {
    const byModule = new Map<string, Permission[]>();
    for (const permission of permissionsQuery.data ?? []) {
      const list = byModule.get(permission.module) ?? [];
      list.push(permission);
      byModule.set(permission.module, list);
    }
    return Array.from(byModule.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [permissionsQuery.data]);

  function toggle(code: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }

  function handleSave() {
    if (!role) return;
    updateMutation.mutate(
      { id: role.id, permissionCodes: Array.from(selected) },
      {
        onSuccess: () => {
          AppFeedback.success('Permisos actualizados correctamente.');
          onOpenChange(false);
        },
        onError: (error) => AppFeedback.error({ title: toFriendlyMessage(error) }),
      },
    );
  }

  return (
    <Dialog open={Boolean(role)} onOpenChange={(next) => !updateMutation.isPending && onOpenChange(next)}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Permisos de {role?.name}</DialogTitle>
          <DialogDescription>
            Marca los permisos que debe tener este rol. {role?.isSystem && 'Rol base del sistema — ajusta con cuidado.'}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[55vh] space-y-5 overflow-y-auto py-2">
          {permissionsQuery.isLoading && <p className="text-sm text-muted-foreground">Cargando permisos…</p>}
          {groups.map(([moduleName, permissions]) => (
            <div key={moduleName} className="space-y-2">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{moduleName}</p>
              <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                {permissions?.map((permission) => (
                  <Label
                    key={permission.id}
                    className="flex items-start gap-2 rounded-md border border-transparent p-1.5 font-normal hover:border-border"
                  >
                    <Checkbox
                      checked={selected.has(permission.code)}
                      onCheckedChange={() => toggle(permission.code)}
                      className="mt-0.5"
                    />
                    <span>
                      <span className="block text-sm text-foreground">{permission.description ?? permission.code}</span>
                      <span className="block text-xs text-muted-foreground">{permission.code}</span>
                    </span>
                  </Label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" disabled={updateMutation.isPending} onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <ButtonLoader onClick={handleSave} loading={updateMutation.isPending} loadingText="Guardando…">
            Guardar
          </ButtonLoader>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
