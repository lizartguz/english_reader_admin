import { expect, test } from './support/fixtures'
import { expectSuccessToast, navigateTo, rowWith, runRowAction, uniqueSuffix } from './support/helpers'

/**
 * Recorre el patrón CRUD completo (doc 02) sobre niveles de lectura, que es
 * el módulo de referencia: filtros, modal de alta, edición, cambio de estado
 * y confirmación de borrado.
 */
test.describe('CRUD de niveles de lectura', () => {
  test('crea, edita y elimina un nivel sin recargar la página', async ({ superAdminPage: page }) => {
    await navigateTo(page, 'nav-reading-levels', 'Niveles de lectura')

    const code = `E2E${uniqueSuffix()}`
    const name = `Nivel ${code}`

    // La navegación es SPA: si algo forzara una recarga, este marcador se perdería.
    await page.evaluate(() => {
      ;(window as unknown as { __sinRecarga: boolean }).__sinRecarga = true
    })

    await page.getByRole('button', { name: 'Crear nivel' }).click()
    await expect(page.getByTestId('form-modal')).toBeVisible()
    await page.getByLabel('Código').fill(code)
    await page.getByLabel('Nombre').fill(name)
    await page.getByLabel('Orden').fill('99')
    await page.getByTestId('form-modal-save').click()

    await expectSuccessToast(page, 'Registro creado correctamente.')
    await expect(rowWith(page, code)).toBeVisible()

    // Editar
    await runRowAction(page, code, 'Editar')
    await expect(page.getByTestId('form-modal')).toBeVisible()
    await page.getByLabel('Nombre').fill(`${name} editado`)
    await page.getByTestId('form-modal-save').click()
    await expectSuccessToast(page, 'Registro actualizado correctamente.')
    await expect(rowWith(page, `${name} editado`)).toBeVisible()

    // Desactivar
    await runRowAction(page, code, 'Desactivar')
    await expectSuccessToast(page, 'Registro actualizado correctamente.')
    await expect(rowWith(page, code)).toContainText('Inactivo')

    // Eliminar, con confirmación previa
    await runRowAction(page, code, 'Eliminar')
    await expect(page.getByTestId('confirm-dialog')).toBeVisible()
    await page.getByTestId('confirm-dialog-accept').click()
    await expectSuccessToast(page, 'Registro eliminado correctamente.')
    await expect(rowWith(page, code)).toHaveCount(0)

    const sinRecarga = await page.evaluate(
      () => (window as unknown as { __sinRecarga?: boolean }).__sinRecarga === true,
    )
    expect(sinRecarga).toBe(true)
  })

  test('valida los campos obligatorios en español y no cierra el modal', async ({
    superAdminPage: page,
  }) => {
    await navigateTo(page, 'nav-reading-levels', 'Niveles de lectura')

    await page.getByRole('button', { name: 'Crear nivel' }).click()
    await page.getByTestId('form-modal-save').click()

    await expect(page.getByText('El código es obligatorio.')).toBeVisible()
    await expect(page.getByText('El nombre es obligatorio.')).toBeVisible()
    await expect(page.getByTestId('form-modal')).toBeVisible()
  })

  test('filtra por estado y permite limpiar los filtros', async ({ superAdminPage: page }) => {
    await navigateTo(page, 'nav-reading-levels', 'Niveles de lectura')
    await expect(page.getByTestId('filter-bar')).toBeVisible()

    await page.getByLabel('Filtrar por estado').click()
    await page.getByRole('option', { name: 'Inactivos' }).click()
    await expect(page.getByLabel('Filtrar por estado')).toContainText('Inactivos')

    await page.getByRole('button', { name: 'Limpiar filtros' }).click()
    await expect(page.getByLabel('Filtrar por estado')).toContainText('Todos los estados')
  })
})
