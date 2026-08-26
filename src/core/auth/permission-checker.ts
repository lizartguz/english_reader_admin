import { useAuthStore } from './auth-store';
import type { PermissionCode } from '@/core/permissions/permissions.enum';
import type { RoleCode } from '@/core/permissions/roles.enum';

/**
 * Permisos visuales: ocultan menús y acciones, pero nunca reemplazan la
 * autorización real que valida `english_reader_api` en cada solicitud.
 */
export function usePermissions() {
  const permissions = useAuthStore((state) => state.user?.permissions ?? []);
  const roles = useAuthStore((state) => state.user?.roles ?? []);

  const hasPermission = (code: PermissionCode): boolean => permissions.includes(code);

  const hasAnyPermission = (codes: readonly PermissionCode[]): boolean =>
    codes.length === 0 || codes.some((code) => permissions.includes(code));

  const hasRole = (code: RoleCode): boolean => roles.includes(code);

  const hasAnyRole = (codes: readonly RoleCode[]): boolean =>
    codes.length === 0 || codes.some((code) => roles.includes(code));

  return { permissions, roles, hasPermission, hasAnyPermission, hasRole, hasAnyRole };
}
