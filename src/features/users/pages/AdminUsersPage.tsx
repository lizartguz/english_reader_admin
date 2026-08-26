import { RoleCode } from '@/core/permissions/roles.enum';
import { UsersManager } from '../components/UsersManager';

const ADMIN_ROLES = [RoleCode.SuperAdmin, RoleCode.Admin];

export function AdminUsersPage() {
  return (
    <UsersManager
      title="Usuarios administradores"
      description="Cuentas con acceso al panel administrativo."
      roleCodes={ADMIN_ROLES}
      defaultRoleCode={RoleCode.Admin}
      showRoles
      createLabel="Crear administrador"
    />
  );
}
