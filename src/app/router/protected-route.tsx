import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuthStore } from '@/core/auth/auth-store';
import { usePermissions } from '@/core/auth/permission-checker';
import { AdminRoutes } from '@/core/config/constants';
import { FullBlockLoader } from '@/core/ui/feedback/CircularLoader';
import { AccessDeniedState } from '@/core/ui/feedback/AccessDeniedState';
import type { RouteAccessRule } from './route-permissions';

/**
 * Protege todo el árbol `/admin`: exige sesión administrativa. Mientras se
 * resuelve el refresh silencioso al arrancar, muestra un loader en vez de
 * redirigir de más (doc 09).
 */
export function ProtectedRoute() {
  const status = useAuthStore((state) => state.status);
  const location = useLocation();

  if (status === 'checking') {
    return <FullBlockLoader label="Verificando sesión…" />;
  }

  if (status === 'unauthenticated') {
    return <Navigate to={AdminRoutes.Login} replace state={{ from: location }} />;
  }

  return <Outlet />;
}

/**
 * Verifica permisos/roles visuales de una ruta ya autenticada. Ocultar aquí
 * nunca reemplaza la validación real que hace `english_reader_api`.
 */
export function RequireAccess({ access, children }: { access: RouteAccessRule; children: ReactNode }) {
  const { hasAnyPermission, hasAnyRole } = usePermissions();

  const permissionsOk = !access.permissions || hasAnyPermission(access.permissions);
  const rolesOk = !access.roles || hasAnyRole(access.roles);

  if (!permissionsOk || !rolesOk) {
    return <AccessDeniedState />;
  }

  return <>{children}</>;
}
