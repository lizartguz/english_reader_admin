/**
 * Códigos de rol, espejo exacto de `RoleCode` en
 * `english_reader_api/src/common/enums/role-code.enum.ts`. Objeto `as const`
 * en vez de `enum` porque el proyecto compila con `erasableSyntaxOnly`.
 */
export const RoleCode = {
  SuperAdmin: 'SUPER_ADMIN',
  Admin: 'ADMIN',
  Client: 'CLIENT',
} as const;

export type RoleCode = (typeof RoleCode)[keyof typeof RoleCode];

/** Roles que pueden acceder al panel administrativo. `CLIENT` nunca ingresa aquí. */
export const ADMIN_PANEL_ROLES: readonly RoleCode[] = [RoleCode.SuperAdmin, RoleCode.Admin];
