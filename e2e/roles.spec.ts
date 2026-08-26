import { expect, test } from './support/fixtures'
import { navigateTo } from './support/helpers'

/**
 * Los roles no se crean ni eliminan desde el panel (decisión del equipo):
 * solo se ajusta qué permisos tiene cada uno.
 */
test.describe('Roles y permisos', () => {
  test('no ofrece crear ni eliminar roles', async ({ superAdminPage: page }) => {
    await navigateTo(page, 'nav-roles', 'Roles y permisos')

    await expect(page.getByRole('button', { name: /Crear rol/ })).toHaveCount(0)
    await expect(page.getByTestId('row-actions')).toHaveCount(0)
  })

  test('abre la matriz de permisos del rol al hacer clic en su fila', async ({
    superAdminPage: page,
  }) => {
    await navigateTo(page, 'nav-roles', 'Roles y permisos')

    const adminRow = page.getByTestId('data-table-row').filter({ hasText: 'ADMIN' }).first()
    await adminRow.click()

    await expect(page.getByText(/^Permisos de/)).toBeVisible()

    // Los permisos llegan agrupados por módulo y con su estado real marcado.
    const checkboxes = page.getByRole('checkbox')
    expect(await checkboxes.count()).toBeGreaterThan(0)

    const marcados = await page.locator('[data-slot="checkbox"][data-checked]').count()
    expect(marcados).toBeGreaterThan(0)

    // Cancelar no debe alterar nada.
    await page.getByRole('button', { name: 'Cancelar' }).click()
    await expect(page.getByText(/^Permisos de/)).toHaveCount(0)
  })

  test('el catálogo de permisos es de solo lectura y se puede filtrar', async ({
    superAdminPage: page,
  }) => {
    await navigateTo(page, 'nav-permissions', 'Permisos')

    await expect(page.getByTestId('data-table-row').first()).toBeVisible()
    await expect(page.getByTestId('row-actions')).toHaveCount(0)

    await page.getByPlaceholder('Buscar por código o descripción…').fill('stories')
    await expect(page.getByTestId('data-table-row').first()).toContainText('stories')
  })
})
