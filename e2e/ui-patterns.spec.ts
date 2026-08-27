import { expect, test } from './support/fixtures'
import { navigateTo } from './support/helpers'

/**
 * Patrones transversales del doc 02/03: migas de pan, ordenamiento por
 * columna, tamaño de página y cambio de contraseña propia.
 */
test.describe('Patrones de interfaz', () => {
  test('las migas de pan reflejan el grupo del menú', async ({ superAdminPage: page }) => {
    // El dashboard es la raíz: no muestra migas sobre su propio título.
    await expect(page.getByTestId('breadcrumbs')).toHaveCount(0)

    await navigateTo(page, 'nav-stories', 'Historias')
    const migas = page.getByTestId('breadcrumbs')
    await expect(migas).toContainText('Dashboard')
    await expect(migas).toContainText('Contenido')
    await expect(migas).toContainText('Historias')

    // El primer nivel navega de vuelta al dashboard.
    await migas.getByRole('link', { name: 'Dashboard' }).click()
    await expect(page.getByTestId('page-title')).toHaveText('Dashboard')
  })

  test('ordena por columna y cambia el tamaño de página', async ({ superAdminPage: page }) => {
    await navigateTo(page, 'nav-stories', 'Historias')

    const encabezadoTitulo = page.getByRole('button', { name: /^Título/ })
    await expect(encabezadoTitulo).toBeVisible()
    await encabezadoTitulo.click()
    await expect(page.getByTestId('data-table')).toBeVisible()

    // Al alternar el mismo encabezado se invierte la dirección.
    await encabezadoTitulo.click()
    await expect(page.getByTestId('data-table')).toBeVisible()

    const porPagina = page.getByLabel('Registros por página')
    await expect(porPagina).toContainText('20')
    await porPagina.click()
    await page.getByRole('option', { name: '50' }).click()
    await expect(porPagina).toContainText('50')
    await expect(page.getByTestId('data-table')).toBeVisible()
  })

  test('filtra historias por rango de publicación', async ({ superAdminPage: page }) => {
    await navigateTo(page, 'nav-stories', 'Historias')

    // Un rango futuro no debe devolver ninguna historia publicada.
    await page.getByLabel('Publicada desde').fill('2099-01-01')
    await expect(page.getByTestId('data-table-empty')).toBeVisible()

    await page.getByRole('button', { name: 'Limpiar filtros' }).click()
    await expect(page.getByLabel('Publicada desde')).toHaveValue('')
    await expect(page.getByTestId('data-table')).toBeVisible()
  })

  test('valida el cambio de contraseña propia sin aplicarlo', async ({ superAdminPage: page }) => {
    await page.getByRole('button', { name: /Super Administrador/ }).click()
    await page.getByRole('menuitem', { name: 'Cambiar contraseña' }).click()
    await expect(page.getByTestId('form-modal')).toBeVisible()

    // Se comprueba solo la validación local: aplicar el cambio invalidaría las
    // credenciales semilla que usa el resto de la suite.
    await page.locator('#currentPassword').fill('SuperAdmin123*')
    await page.locator('#newPassword').fill('corta')
    await page.locator('#confirmPassword').fill('corta')
    await page.getByTestId('form-modal-save').click()

    await expect(page.getByText('La contraseña debe tener al menos 8 caracteres.')).toBeVisible()
    await expect(page.getByTestId('form-modal')).toBeVisible()

    await page.getByRole('button', { name: 'Cancelar' }).click()
    await expect(page.getByTestId('form-modal')).toHaveCount(0)
  })

  test('una fila clicable se puede abrir con el teclado', async ({ superAdminPage: page }) => {
    await navigateTo(page, 'nav-roles', 'Roles y permisos')

    // La matriz de permisos solo se abre haciendo clic en la fila, así que la
    // fila debe ser enfocable y activarse con Enter: de lo contrario, gestionar
    // permisos queda fuera del alcance de quien navega sin ratón.
    const fila = page.getByTestId('data-table-row').filter({ hasText: /^ADMIN/ }).first()
    await fila.focus()
    await expect(fila).toBeFocused()
    await page.keyboard.press('Enter')

    await expect(page.getByTestId('role-permissions-modal')).toBeVisible()
  })

  test('una ruta inexistente lo dice en vez de redirigir en silencio', async ({
    superAdminPage: page,
  }) => {
    await page.goto('/admin/esta-ruta-no-existe')

    await expect(page.getByTestId('not-found-title')).toBeVisible()
    expect(page.url()).toContain('/admin/esta-ruta-no-existe')

    await page.getByRole('link', { name: 'Ir al dashboard' }).click()
    await expect(page.getByTestId('page-title')).toHaveText('Dashboard')
  })
})

test.describe('Vista de detalle', () => {
  test('la historia muestra su contenido completo sin permitir editarlo', async ({
    superAdminPage: page,
  }) => {
    await navigateTo(page, 'nav-stories', 'Historias')

    await page.getByTestId('data-table-row').first().getByTestId('row-actions').click()
    await page.getByRole('menuitem', { name: 'Ver' }).click()

    const detalle = page.getByTestId('detail-dialog')
    await expect(detalle).toBeVisible()
    await expect(detalle).toContainText('Contenido')
    await expect(detalle).toContainText('Nivel')
    // Es solo lectura: sin botón de guardado ni campos editables.
    await expect(page.getByTestId('form-modal-save')).toHaveCount(0)
    await expect(detalle.locator('input')).toHaveCount(0)
  })

  test('la palabra muestra sus traducciones y ejemplos', async ({ superAdminPage: page }) => {
    await navigateTo(page, 'nav-dictionary', 'Palabras')

    const filas = await page.getByTestId('data-table-row').count()
    test.skip(filas === 0, 'No hay palabras en esta base')

    await page.getByTestId('data-table-row').first().getByTestId('row-actions').click()
    await page.getByRole('menuitem', { name: 'Ver detalle' }).click()

    const detalle = page.getByTestId('detail-dialog')
    await expect(detalle).toBeVisible()
    await expect(detalle).toContainText('Traducciones')
    await expect(detalle).toContainText('Revisión')
  })
})
