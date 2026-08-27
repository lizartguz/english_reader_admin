import { useMemo, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ButtonLoader } from '@/core/ui/feedback/ButtonLoader';
import { CircularLoader } from '@/core/ui/feedback/CircularLoader';
import { ConfirmDialog } from '@/core/ui/feedback/ConfirmDialog';
import { AppFeedback } from '@/core/ui/feedback/AppFeedback';
import { toFriendlyMessage } from '@/core/errors/friendly-error';
import { RoleCode } from '@/core/permissions/roles.enum';
import { usePermissionsQuery } from '@/features/permissions/hooks/use-permissions-query';
import type { Permission } from '@/features/permissions/types/permission.types';
import { useRoleDetailQuery } from '../hooks/use-roles-query';
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

  // El rol se vuelve a pedir al abrir el modal en lugar de reutilizar la copia
  // del listado: como se envía el conjunto completo de permisos, partir de
  // datos viejos borraría en silencio lo que otro administrador acabe de hacer.
  const roleQuery = useRoleDetailQuery(role?.id ?? null);
  const roleActual = roleQuery.data ?? role;

  const updateMutation = useUpdateRolePermissions();
  const [confirmarSistema, setConfirmarSistema] = useState(false);

  // La selección se **deriva** del rol mientras nadie haya tocado una casilla:
  // así, cuando llega la versión fresca del servidor, las casillas se ajustan
  // solas sin sincronizar estado dentro de un efecto. En cuanto hay un cambio
  // manual, manda lo que eligió el usuario.
  const [seleccionManual, setSeleccionManual] = useState<Set<string> | null>(null);
  const selected = seleccionManual ?? new Set(roleActual?.permissions ?? []);

  // El rol super administrador gobierna esta misma pantalla: si se le quitara
  // `roles.update`, nadie podría devolvérselo desde el panel. La API lo rechaza;
  // aquí se muestra de solo lectura para no ofrecer una acción que va a fallar.
  const esSuperAdmin = roleActual?.code === RoleCode.SuperAdmin;
  const editable = !esSuperAdmin;

  const groups = useMemo(() => {
    const byModule = new Map<string, Permission[]>();
    for (const permission of permissionsQuery.data ?? []) {
      const list = byModule.get(permission.module) ?? [];
      list.push(permission);
      byModule.set(permission.module, list);
    }
    return Array.from(byModule.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [permissionsQuery.data]);

  const cargando = permissionsQuery.isLoading || roleQuery.isLoading;

  function toggle(code: string) {
    const next = new Set(selected);
    if (next.has(code)) next.delete(code);
    else next.add(code);
    setSeleccionManual(next);
  }

  function guardar() {
    if (!roleActual) return;
    updateMutation.mutate(
      { id: roleActual.id, permissionCodes: Array.from(selected) },
      {
        onSuccess: () => {
          AppFeedback.success('Permisos actualizados correctamente.');
          setConfirmarSistema(false);
          onOpenChange(false);
        },
        onError: (error) => {
          setConfirmarSistema(false);
          AppFeedback.error({ title: toFriendlyMessage(error) });
        },
      },
    );
  }

  /** Los roles base afectan a todas las cuentas que los tengan: se confirma. */
  function handleSave() {
    if (roleActual?.isSystem) setConfirmarSistema(true);
    else guardar();
  }

  return (
    <>
      <Dialog open={Boolean(role)} onOpenChange={(next) => !updateMutation.isPending && onOpenChange(next)}>
        <DialogContent className="sm:max-w-2xl" data-testid="role-permissions-modal">
          <DialogHeader>
            <DialogTitle>Permisos de {roleActual?.name}</DialogTitle>
            <DialogDescription>
              {esSuperAdmin
                ? 'Este rol conserva siempre todos los permisos y no puede modificarse.'
                : 'Marca los permisos que debe tener este rol.'}
            </DialogDescription>
          </DialogHeader>

          {esSuperAdmin && (
            <p
              className="flex items-start gap-2 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground"
              role="note"
            >
              <ShieldAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
              Quitarle permisos dejaría al sistema sin ninguna cuenta capaz de restaurarlos, así que
              se muestra solo para consulta.
            </p>
          )}

          <div className="max-h-[55vh] space-y-5 overflow-y-auto py-2">
            {cargando && <CircularLoader label="Cargando permisos…" />}
            {groups.map(([moduleName, permissions]) => (
              <div key={moduleName} className="space-y-2">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{moduleName}</p>
                <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                  {permissions.map((permission) => (
                    <Label
                      key={permission.id}
                      className="flex items-start gap-2 rounded-md border border-transparent p-1.5 font-normal hover:border-border"
                    >
                      <Checkbox
                        checked={selected.has(permission.code)}
                        onCheckedChange={() => toggle(permission.code)}
                        disabled={!editable}
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
              {editable ? 'Cancelar' : 'Cerrar'}
            </Button>
            {editable && (
              <ButtonLoader
                onClick={handleSave}
                loading={updateMutation.isPending}
                loadingText="Guardando…"
                disabled={cargando}
                data-testid="role-permissions-save"
              >
                Guardar
              </ButtonLoader>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmarSistema}
        onOpenChange={(open) => !open && setConfirmarSistema(false)}
        title={`¿Actualizar los permisos de ${roleActual?.name}?`}
        description="Es un rol base del sistema: el cambio afecta de inmediato a todas las cuentas que lo tengan."
        confirmLabel="Actualizar permisos"
        loading={updateMutation.isPending}
        onConfirm={guardar}
      />
    </>
  );
}
