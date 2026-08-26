/**
 * Usuarios semilla de desarrollo (`users.seeder.ts` del backend).
 * No son credenciales de producción: fuera de desarrollo el seeder exige
 * variables de entorno propias del servidor.
 */
export const SEED_USERS = {
  superAdmin: {
    email: process.env.E2E_SUPER_ADMIN_EMAIL ?? 'superadmin@englishreader.local',
    password: process.env.E2E_SUPER_ADMIN_PASSWORD ?? 'SuperAdmin123*',
  },
  admin: {
    email: process.env.E2E_ADMIN_EMAIL ?? 'admin@englishreader.local',
    password: process.env.E2E_ADMIN_PASSWORD ?? 'Admin123*',
  },
} as const
