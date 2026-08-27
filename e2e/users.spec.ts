import { expect, test } from './support/fixtures'
import { expectSuccessToast, navigateTo, rowWith, runRowAction, uniqueSuffix } from './support/helpers'

test.describe('Usuarios', () => {
  test('crea un cliente, lo bloquea y lo elimina', async ({ superAdminPage: page }) => {
    await navigateTo(page, 'nav-users-clients', 'Usuarios cliente')

    const sufijo = uniqueSuffix()
    const nombre = `Prueba${sufijo}`
    const correo = `prueba.${sufijo}@englishreader.local`

    await page.getByRole('button', { name: 'Crear cliente' }).click()
    await expect(page.getByTestId('form-modal')).toBeVisible()
    await page.getByLabel('Nombre').fill(nombre)
    await page.getByLabel('Apellido').fill('E2E')
    await page.getByLabel('Correo electrónico').fill(correo)
    await page.getByLabel('Contraseña').fill('Prueba123*')
    await page.getByTestId('form-modal-save').click()
    await expectSuccessToast(page, 'Registro creado correctamente.')

    // Creado por un administrador: nace activo y con el correo ya verificado.
    await expect(rowWith(page, correo)).toContainText('Activo')

    await runRowAction(page, correo, 'Bloquear')
    await expectSuccessToast(page, 'Registro actualizado correctamente.')
    await expect(rowWith(page, correo)).toContainText('Bloqueado')

    await runRowAction(page, correo, 'Eliminar')
    await expect(page.getByTestId('confirm-dialog')).toBeVisible()
    await page.getByTestId('confirm-dialog-accept').click()
    await expectSuccessToast(page, 'Registro eliminado correctamente.')
    await expect(rowWith(page, correo)).toHaveCount(0)
  })

  test('muestra el detalle con los permisos efectivos', async ({ superAdminPage: page }) => {
    await navigateTo(page, 'nav-users-admins', 'Usuarios administradores')

    await runRowAction(page, 'superadmin@englishreader.local', 'Ver')
    const detalle = page.getByTestId('detail-dialog')
    await expect(detalle).toBeVisible()
    await expect(detalle).toContainText('Permisos efectivos')
    await expect(detalle).toContainText('SUPER_ADMIN')
  })

  test('la pantalla de administradores lista ambos roles administrativos', async ({
    superAdminPage: page,
  }) => {
    await navigateTo(page, 'nav-users-admins', 'Usuarios administradores')

    // El filtro por roles múltiples debe traer SUPER_ADMIN y ADMIN juntos.
    await expect(rowWith(page, 'SUPER_ADMIN')).toBeVisible()
    await expect(rowWith(page, 'ADMIN')).toBeVisible()
    // Y ningún cliente debe colarse en esta pantalla.
    await expect(page.getByTestId('data-table-row').filter({ hasText: 'CLIENT' })).toHaveCount(0)
  })

  test('no ofrece acciones destructivas sobre la propia cuenta', async ({ superAdminPage: page }) => {
    await navigateTo(page, 'nav-users-admins', 'Usuarios administradores')

    // La API rechaza cambiar el estado, los roles o eliminar la cuenta propia;
    // sobre los roles no lo hacía, y un super administrador podía degradarse a
    // sí mismo y quedarse sin acceso. Aquí no debe siquiera ofrecerse.
    const propia = rowWith(page, 'superadmin@englishreader.local')
    await expect(propia).toBeVisible()
    await propia.getByTestId('row-actions').click()

    await expect(page.getByRole('menuitem', { name: 'Ver' })).toBeVisible()
    for (const accion of ['Asignar roles', 'Eliminar', 'Bloquear', 'Desactivar']) {
      await expect(page.getByRole('menuitem', { name: accion })).toHaveCount(0)
    }

    await page.keyboard.press('Escape')
  })

  test('rechaza una contraseña que no cumple la política', async ({ superAdminPage: page }) => {
    await navigateTo(page, 'nav-users-clients', 'Usuarios cliente')

    await page.getByRole('button', { name: 'Crear cliente' }).click()
    await page.getByLabel('Contraseña').fill('corta')
    await page.getByTestId('form-modal-save').click()

    await expect(page.getByText('La contraseña debe tener al menos 8 caracteres.')).toBeVisible()
    await expect(page.getByTestId('form-modal')).toBeVisible()
  })
})
