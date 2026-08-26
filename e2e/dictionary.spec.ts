import { expect, test } from './support/fixtures'
import { expectSuccessToast, navigateTo, rowWith, runRowAction, uniqueSuffix } from './support/helpers'

test.describe('Diccionario', () => {
  test('gestiona una palabra con sus traducciones anidadas', async ({ superAdminPage: page }) => {
    await navigateTo(page, 'nav-dictionary', 'Palabras')

    const word = `e2eword${uniqueSuffix()}`

    await page.getByRole('button', { name: 'Crear palabra' }).click()
    await page.getByTestId('form-modal').getByLabel('Palabra').fill(word)
    await page.getByTestId('form-modal').getByLabel('Definición en inglés').fill('A word created by the E2E suite.')
    await page.getByTestId('form-modal-save').click()
    await expectSuccessToast(page, 'Registro creado correctamente.')

    // Las palabras creadas desde administración nacen revisadas.
    await expect(rowWith(page, word)).toContainText('Revisada')

    await runRowAction(page, word, 'Traducciones')
    await expect(page.getByText(`Traducciones de «${word}»`)).toBeVisible()
    await expect(page.getByText('Sin traducciones')).toBeVisible()

    await page.getByLabel('Nueva traducción').fill('palabra de prueba')
    await page.getByRole('button', { name: 'Agregar traducción' }).click()
    await expectSuccessToast(page, 'Traducción creada correctamente.')
    await expect(page.getByText('palabra de prueba')).toBeVisible()

    await page.getByTitle('Rechazar').first().click()
    await expectSuccessToast(page, 'Registro actualizado correctamente.')
    await expect(page.getByText('Rechazada')).toBeVisible()

    await page.keyboard.press('Escape')
    await runRowAction(page, word, 'Eliminar')
    await page.getByTestId('confirm-dialog-accept').click()
    await expectSuccessToast(page, 'Registro eliminado correctamente.')
  })

  test('muestra un error amigable al duplicar una palabra', async ({ superAdminPage: page }) => {
    await navigateTo(page, 'nav-dictionary', 'Palabras')

    const word = `dup${uniqueSuffix()}`

    // Dos intentos con la misma palabra: el segundo debe chocar.
    for (let intento = 0; intento < 2; intento += 1) {
      await page.getByRole('button', { name: 'Crear palabra' }).click()
      await page.getByTestId('form-modal').getByLabel('Palabra').fill(word)
      await page.getByTestId('form-modal-save').click()
      await page.waitForTimeout(600)
    }

    // El segundo intento choca con la restricción única y debe explicarse sin
    // exponer el error SQL crudo.
    const error = page.getByTestId('form-modal').getByRole('alert')
    await expect(error).toBeVisible()
    await expect(error).not.toContainText(/sql|constraint|duplicate entry/i)

    await page.getByRole('button', { name: 'Cancelar' }).click()
    await runRowAction(page, word, 'Eliminar')
    await page.getByTestId('confirm-dialog-accept').click()
    await expectSuccessToast(page, 'Registro eliminado correctamente.')
  })
})
