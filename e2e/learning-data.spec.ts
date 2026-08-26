import { expect, test } from './support/fixtures'
import { navigateTo } from './support/helpers'

/**
 * Módulos de solo lectura sobre datos de aprendizaje y trazabilidad.
 *
 * Las tablas pueden estar vacías si todavía no hay clientes usando la app, así
 * que las aserciones comprueban que la pantalla resuelve correctamente (tabla
 * o estado vacío), nunca que existan filas concretas.
 */
async function tablaOVacio(page: Parameters<typeof navigateTo>[0]) {
  const tabla = page.getByTestId('data-table')
  const vacio = page.getByTestId('data-table-empty')
  await expect(tabla.or(vacio)).toBeVisible()
  await expect(page.getByTestId('data-table-error')).toHaveCount(0)
}

test.describe('Vocabulario', () => {
  test('carga el listado y filtra por estado', async ({ superAdminPage: page }) => {
    await navigateTo(page, 'nav-vocabulary', 'Vocabulario')
    await tablaOVacio(page)

    await page.getByLabel('Filtrar por estado').click()
    await page.getByRole('option', { name: 'Aprendida' }).click()
    await expect(page.getByLabel('Filtrar por estado')).toContainText('Aprendida')
    await tablaOVacio(page)

    // No es un módulo editable: no debe ofrecer acciones de fila ni creación.
    await expect(page.getByTestId('row-actions')).toHaveCount(0)
    await expect(page.getByRole('button', { name: /Crear/ })).toHaveCount(0)
  })
})

test.describe('Progreso de lectura', () => {
  test('carga el listado y filtra por completadas', async ({ superAdminPage: page }) => {
    await navigateTo(page, 'nav-reading-progress', 'Progreso de lectura')
    await tablaOVacio(page)

    await page.getByLabel('Filtrar por estado').click()
    await page.getByRole('option', { name: 'Completadas' }).click()
    await expect(page.getByLabel('Filtrar por estado')).toContainText('Completadas')
    await tablaOVacio(page)

    await expect(page.getByTestId('row-actions')).toHaveCount(0)
  })
})

test.describe('Auditoría', () => {
  test('lista eventos y permite ver el detalle', async ({ superAdminPage: page }) => {
    await navigateTo(page, 'nav-audit', 'Auditoría')

    // La auditoría siempre tiene registros: el propio login queda auditado.
    const primera = page.getByTestId('data-table-row').first()
    await expect(primera).toBeVisible()

    await primera.getByTestId('row-actions').click()
    await page.getByRole('menuitem', { name: 'Ver detalle' }).click()

    const detalle = page.getByTestId('detail-dialog')
    await expect(detalle).toBeVisible()
    await expect(detalle).toContainText('Acción')
    await expect(detalle).toContainText('Entidad')
  })

  test('filtra por acción sin recargar la página', async ({ superAdminPage: page }) => {
    await navigateTo(page, 'nav-audit', 'Auditoría')

    await page.getByPlaceholder('Acción (ej. story.created)').fill('auth.login')
    await expect(page.getByTestId('data-table-row').first()).toContainText('auth.login')

    await page.getByRole('button', { name: 'Limpiar filtros' }).click()
    await expect(page.getByPlaceholder('Acción (ej. story.created)')).toHaveValue('')
  })

  test('no permite editar ni eliminar registros de auditoría', async ({ superAdminPage: page }) => {
    await navigateTo(page, 'nav-audit', 'Auditoría')

    await page.getByTestId('data-table-row').first().getByTestId('row-actions').click()
    // El único elemento del menú debe ser la consulta de detalle.
    await expect(page.getByRole('menuitem')).toHaveCount(1)
    await expect(page.getByRole('menuitem', { name: 'Ver detalle' })).toBeVisible()
  })
})

test.describe('Logs del sistema', () => {
  test('lista registros técnicos y muestra su detalle', async ({ superAdminPage: page }) => {
    await navigateTo(page, 'nav-system-logs', 'Logs del sistema')
    await tablaOVacio(page)

    // Una base recién sembrada puede no tener incidencias técnicas todavía.
    if (await page.getByTestId('data-table-empty').isVisible()) {
      test.skip(true, 'No hay registros técnicos en esta base')
    }

    await expect(page.getByTestId('data-table-row').first()).toBeVisible()
    await page.getByTestId('data-table-row').first().getByTestId('row-actions').click()
    await page.getByRole('menuitem', { name: 'Ver detalle' }).click()
    await expect(page.getByTestId('detail-dialog')).toContainText('Fuente')
  })
})
