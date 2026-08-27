import { useAuthStore } from './auth-store';
import type { PermissionCode } from '@/core/permissions/permissions.enum';
import type { RoleCode } from '@/core/permissions/roles.enum';

/**
 * Referencia estable para el caso «sin sesión».
 *
 * Zustand v5 se apoya en `useSyncExternalStore`, que compara el resultado del
 * selector por identidad: devolver un `[]` nuevo en cada evaluación puede
 * provocar el error «getSnapshot should be cached» y un ciclo de renders.
 */
const SIN_VALORES: readonly string[] = [];

/**
 * Permisos visuales: ocultan menús y acciones, pero nunca reemplazan la
 * autorización real que valida `english_reader_api` en cada solicitud.
 */
export function usePermissions() {
  const permissions = useAuthStore((state) => state.user?.permissions ?? SIN_VALORES);
  const roles = useAuthStore((state) => state.user?.roles ?? SIN_VALORES);

  const hasPermission = (code: PermissionCode): boolean => permissions.includes(code);

  const hasAnyPermission = (codes: readonly PermissionCode[]): boolean =>
    codes.length === 0 || codes.some((code) => permissions.includes(code));

  const hasRole = (code: RoleCode): boolean => roles.includes(code);

  const hasAnyRole = (codes: readonly RoleCode[]): boolean =>
    codes.length === 0 || codes.some((code) => roles.includes(code));

  return { permissions, roles, hasPermission, hasAnyPermission, hasRole, hasAnyRole };
}
