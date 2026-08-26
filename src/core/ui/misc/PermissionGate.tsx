import type { ReactNode } from 'react';
import { usePermissions } from '@/core/auth/permission-checker';
import type { PermissionCode } from '@/core/permissions/permissions.enum';
import type { RoleCode } from '@/core/permissions/roles.enum';

interface PermissionGateProps {
  permission?: PermissionCode | readonly PermissionCode[];
  role?: RoleCode | readonly RoleCode[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Oculta contenido según permisos/roles visuales. Nunca es la protección
 * real: la API vuelve a validar cada acción (doc 01/04).
 */
export function PermissionGate({ permission, role, children, fallback = null }: PermissionGateProps) {
  const { hasAnyPermission, hasAnyRole } = usePermissions();

  const permissionCodes = permission
    ? Array.isArray(permission)
      ? permission
      : [permission]
    : undefined;
  const roleCodes = role ? (Array.isArray(role) ? role : [role]) : undefined;

  if (permissionCodes && !hasAnyPermission(permissionCodes)) return <>{fallback}</>;
  if (roleCodes && !hasAnyRole(roleCodes)) return <>{fallback}</>;

  return <>{children}</>;
}
