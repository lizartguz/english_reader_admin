import { AdminRoutes } from '@/core/config/constants';
import { PermissionCode } from '@/core/permissions/permissions.enum';
import { RoleCode } from '@/core/permissions/roles.enum';

export interface RouteAccessRule {
  /** Basta con tener uno de estos permisos (OR). Vacío = cualquier admin autenticado. */
  permissions?: PermissionCode[];
  /** Si se define, el rol también debe coincidir (OR entre roles). */
  roles?: RoleCode[];
}

/**
 * Configuración central de acceso por ruta (doc 09): la usan `ProtectedRoute`
 * para redirigir/denegar y el sidebar para ocultar ítems. Ocultar en UI nunca
 * reemplaza la validación real de `english_reader_api`.
 */
export const routeAccessRules: Record<string, RouteAccessRule> = {
  [AdminRoutes.Dashboard]: {},
  [AdminRoutes.Stories]: { permissions: [PermissionCode.StoriesRead] },
  [AdminRoutes.ReadingLevels]: { permissions: [PermissionCode.ReadingLevelsRead] },
  [AdminRoutes.Genres]: { permissions: [PermissionCode.GenresRead] },
  [AdminRoutes.Dictionary]: { permissions: [PermissionCode.WordsRead] },
  [AdminRoutes.UsersClients]: { permissions: [PermissionCode.UsersRead] },
  [AdminRoutes.UsersAdmins]: { roles: [RoleCode.SuperAdmin] },
  [AdminRoutes.Roles]: { roles: [RoleCode.SuperAdmin] },
  [AdminRoutes.Permissions]: { roles: [RoleCode.SuperAdmin] },
  [AdminRoutes.Vocabulary]: { permissions: [PermissionCode.VocabularyRead] },
  [AdminRoutes.ReadingProgress]: { permissions: [PermissionCode.ReadingProgressRead] },
  [AdminRoutes.Audit]: { permissions: [PermissionCode.AuditRead] },
  [AdminRoutes.SystemLogs]: { roles: [RoleCode.SuperAdmin] },
};
