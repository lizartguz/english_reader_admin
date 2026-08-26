import { RoleCode } from '@/core/permissions/roles.enum';
import { UsersManager } from '../components/UsersManager';

const CLIENT_ROLES = [RoleCode.Client];

export function ClientUsersPage() {
  return (
    <UsersManager
      title="Usuarios cliente"
      description="Cuentas de lectores de la aplicación móvil."
      roleCodes={CLIENT_ROLES}
      defaultRoleCode={RoleCode.Client}
      showRoles={false}
      createLabel="Crear cliente"
    />
  );
}
