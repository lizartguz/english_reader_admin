import { expect, test } from './support/fixtures'
import { expectSuccessToast, navigateTo, rowWith, runRowAction, uniqueSuffix } from './support/helpers'

/**
 * Precarga de vocabulario (caso de uso del módulo).
 *
 * El objetivo del formulario enriquecido es que un administrador deje una
 * palabra lista —con traducción, ejemplo y pronunciación— para que la app
 * móvil la resuelva desde la base local en vez de llamar al proveedor externo.
 * Esta prueba recorre ese flujo completo y comprueba que lo precargado aparece
 * ya revisado y atribuido en el listado global de traducciones.
 */
test.describe('Traducciones', () => {
  test('precarga una palabra completa y la revisa desde el listado global', async ({
    superAdminPage: page,
  }) => {
    const word = `seed${uniqueSuffix()}`

    await navigateTo(page, 'nav-dictionary', 'Palabras')
    await page.getByRole('button', { name: 'Crear palabra' }).click()

    const modal = page.getByTestId('form-modal')
    await modal.getByLabel('Palabra').fill(word)
    await modal.getByLabel('Fonética').fill('/siːd/')
    await modal.getByLabel('Definición en inglés').fill('A word pre-loaded by the E2E suite.')

    // Las colecciones anidadas arrancan vacías: cada fila se agrega a mano.
    await modal.getByRole('button', { name: 'Agregar traducción' }).click()
    await modal.getByRole('textbox', { name: 'Traducción 1', exact: true }).fill('semilla')
    await modal.getByRole('textbox', { name: 'Contexto de la traducción 1', exact: true }).fill('botánica')

    // Una segunda acepción valida el arreglo dinámico.
    await modal.getByRole('button', { name: 'Agregar traducción' }).click()
    await modal.getByRole('textbox', { name: 'Traducción 2', exact: true }).fill('germen')

    // Ejemplos y pronunciaciones arrancan plegados: hay que abrirlos primero.
    await modal.getByRole('button', { name: 'Ejemplos de uso' }).click()
    await modal.getByRole('button', { name: 'Agregar ejemplo' }).click()
    await modal.getByRole('textbox', { name: 'Ejemplo 1', exact: true }).fill('The seed grew into a tree.')

    await modal.getByRole('button', { name: 'Pronunciaciones' }).click()
    await modal.getByRole('button', { name: 'Agregar pronunciación' }).click()
    await modal.getByRole('textbox', { name: 'Acento 1', exact: true }).fill('en-US')

    await page.getByTestId('form-modal-save').click()
    await expectSuccessToast(page, 'Registro creado correctamente.')
    await expect(rowWith(page, word)).toContainText('Revisada')

    // Lo precargado debe llegar al listado global ya revisado y atribuido: una
    // traducción marcada «Revisada» sin revisor sería un estado incoherente.
    await navigateTo(page, 'nav-translations', 'Traducciones')
    await page.getByPlaceholder('Buscar palabra…').fill(word)
    await expect(page.getByTestId('data-table-row')).toHaveCount(2)

    const fila = rowWith(page, 'semilla')
    await expect(fila).toContainText('Revisada')
    await expect(fila).toContainText('Super Administrador')

    // Corregir y aprobar en un solo gesto desde el modal de revisión.
    await runRowAction(page, 'semilla', 'Editar y revisar')
    const revision = page.getByTestId('review-translation-modal')
    await expect(revision).toBeVisible()
    await expect(revision).toContainText(word)
    await revision.getByLabel('Traducción').fill('semilla corregida')
    await page.getByTestId('save-and-approve').click()
    await expectSuccessToast(page, 'Traducción aprobada correctamente.')
    await expect(rowWith(page, 'semilla corregida')).toBeVisible()

    // Limpieza: borrar la palabra arrastra sus traducciones.
    await navigateTo(page, 'nav-dictionary', 'Palabras')
    await page.getByPlaceholder(/Buscar palabra/i).first().fill(word)
    await runRowAction(page, word, 'Eliminar')
    await page.getByTestId('confirm-dialog-accept').click()
    await expectSuccessToast(page, 'Registro eliminado correctamente.')
  })

  test('filtra por estado de revisión e idioma destino', async ({ superAdminPage: page }) => {
    await navigateTo(page, 'nav-translations', 'Traducciones')

    await page.getByLabel('Filtrar por estado de revisión').click()
    await page.getByRole('option', { name: 'Pendientes' }).click()

    await page.getByLabel('Filtrar por idioma destino').click()
    await page.getByRole('option', { name: 'Español' }).click()

    // Con filtros activos la tabla responde: o hay filas, o el estado vacío.
    const filas = page.getByTestId('data-table-row')
    const vacio = page.getByTestId('data-table-empty')
    await expect(filas.first().or(vacio)).toBeVisible()

    await page.getByRole('button', { name: 'Limpiar filtros' }).click()
    await expect(page.getByLabel('Filtrar por estado de revisión')).toContainText('Toda revisión')
  })
})
