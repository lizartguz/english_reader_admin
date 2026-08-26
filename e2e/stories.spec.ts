import { expect, test } from './support/fixtures'
import { expectSuccessToast, navigateTo, rowWith, runRowAction, uniqueSuffix } from './support/helpers'

/** PNG mínimo válido: el backend valida el contenido real con `sharp`. */
const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
)

test.describe('Historias', () => {
  test('crea, publica, adjunta una portada y elimina una historia', async ({
    superAdminPage: page,
  }) => {
    await navigateTo(page, 'nav-stories', 'Historias')

    const title = `Historia E2E ${uniqueSuffix()}`

    await page.getByRole('button', { name: 'Crear historia' }).click()
    await expect(page.getByTestId('form-modal')).toBeVisible()
    await page.getByLabel('Título').fill(title)
    await page.getByLabel('Autor').fill('Autor E2E')
    await page.getByLabel('Contenido').fill('Contenido de prueba para la verificación automatizada.')
    await page.getByLabel('Nivel de lectura').click()
    await page.getByRole('option').first().click()
    await page.getByTestId('form-modal-save').click()

    await expectSuccessToast(page, 'Registro creado correctamente.')
    // Nace siempre en borrador; publicar es una acción explícita aparte.
    await expect(rowWith(page, title)).toContainText('Borrador')

    await runRowAction(page, title, 'Publicar')
    await expectSuccessToast(page, 'Registro actualizado correctamente.')
    await expect(rowWith(page, title)).toContainText('Publicada')

    // Carga de archivo protegido
    await runRowAction(page, title, 'Recursos')
    await expect(page.getByText(`Recursos de «${title}»`)).toBeVisible()
    await page.setInputFiles('input[type="file"]', {
      name: 'portada.png',
      mimeType: 'image/png',
      buffer: PNG_1X1,
    })
    await expectSuccessToast(page, 'Archivo cargado correctamente.')
    // La API convierte las portadas a WebP antes de almacenarlas.
    await expect(page.getByText('image/webp')).toBeVisible()

    await page.keyboard.press('Escape')
    await runRowAction(page, title, 'Eliminar')
    await page.getByTestId('confirm-dialog-accept').click()
    await expectSuccessToast(page, 'Registro eliminado correctamente.')
    await expect(rowWith(page, title)).toHaveCount(0)
  })

  test('rechaza un archivo con formato no permitido antes de enviarlo', async ({
    superAdminPage: page,
  }) => {
    await navigateTo(page, 'nav-stories', 'Historias')

    const firstRow = page.getByTestId('data-table-row').first()
    await firstRow.getByTestId('row-actions').click()
    await page.getByRole('menuitem', { name: 'Recursos' }).click()
    await expect(page.getByText(/^Recursos de/)).toBeVisible()

    await page.setInputFiles('input[type="file"]', {
      name: 'notas.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('texto plano'),
    })

    await expect(page.getByText(/no tiene un formato de imagen permitido/)).toBeVisible()
  })
})
