import { expect, test } from './support/fixtures'

/** Ítems del menú que solo puede ver `SUPER_ADMIN` (doc 01/09). */
const RESTRINGIDOS = ['nav-system-logs', 'nav-audit', 'nav-roles', 'nav-permissions', 'nav-users-admins']

/**
 * Visibilidad por rol. `ADMIN` no tiene `audit.read`, `system_logs.read` ni la
 * gestión de roles y de usuarios administradores.
 */
test.describe('Permisos visuales', () => {
  test('SUPER_ADMIN ve las secciones restringidas', async ({ superAdminPage: page }) => {
    for (const testId of RESTRINGIDOS) {
      await expect(page.getByTestId(testId)).toBeVisible()
    }
  })

  test('ADMIN no ve logs del sistema, auditoría ni gestión de roles', async ({ adminPage: page }) => {
    for (const testId of RESTRINGIDOS) {
      await expect(page.getByTestId(testId)).toHaveCount(0)
    }

    // Sí conserva los módulos de contenido y clientes.
    await expect(page.getByTestId('nav-stories')).toBeVisible()
    await expect(page.getByTestId('nav-users-clients')).toBeVisible()
  })

  test('ADMIN recibe acceso denegado al entrar por URL a logs del sistema', async ({
    adminPage: page,
  }) => {
    await page.goto('/admin/system-logs')

    await expect(page.getByText('Acceso denegado')).toBeVisible()
    await expect(page.getByText('No tienes permiso para acceder a esta sección.')).toBeVisible()
    // No debe revelar guards, endpoints ni estructura interna de permisos.
    await expect(page.locator('body')).not.toContainText(/guard|system_logs\.read|endpoint/i)
  })
})
