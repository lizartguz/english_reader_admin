import { expect, test } from '@playwright/test'
import { login } from './support/helpers'

/**
 * Cobertura móvil (doc 03/06). Este archivo corre en el proyecto `movil`
 * de `playwright.config.ts`, con viewport de teléfono.
 *
 * El sidebar de escritorio permanece en el DOM oculto por CSS, así que los
 * `nav-*` existen por duplicado: las aserciones se acotan al contenedor que
 * corresponde (`sidebar-desktop` o `sidebar-mobile`).
 */
test.describe('Responsive en móvil', () => {
  test('el sidebar se oculta y se abre como drawer', async ({ page }) => {
    await login(page)

    // En móvil el sidebar fijo no se muestra; la navegación vive en el drawer.
    await expect(page.getByTestId('sidebar-desktop')).toBeHidden()
    await expect(page.getByTestId('sidebar-mobile')).toHaveCount(0)

    await page.getByRole('button', { name: 'Abrir menú' }).click()
    const drawer = page.getByTestId('sidebar-mobile')
    await expect(drawer).toBeVisible()

    await drawer.getByTestId('nav-reading-levels').click()
    await expect(page.getByTestId('page-title')).toHaveText('Niveles de lectura')

    // Al navegar, el drawer se cierra solo.
    await expect(page.getByTestId('sidebar-mobile')).toHaveCount(0)
  })

  test('la tabla se mantiene usable con scroll horizontal controlado', async ({ page }) => {
    await login(page)
    await page.getByRole('button', { name: 'Abrir menú' }).click()
    await page.getByTestId('sidebar-mobile').getByTestId('nav-reading-levels').click()
    await expect(page.getByTestId('page-title')).toHaveText('Niveles de lectura')

    // El cuerpo no debe desbordarse: el scroll pertenece al contenedor de la tabla.
    const desbordaBody = await page.evaluate(
      () => document.body.scrollWidth > document.documentElement.clientWidth + 1,
    )
    expect(desbordaBody).toBe(false)
  })

  test('los modales son usables en pantalla pequeña', async ({ page }) => {
    await login(page)
    await page.getByRole('button', { name: 'Abrir menú' }).click()
    await page.getByTestId('sidebar-mobile').getByTestId('nav-genres').click()
    await expect(page.getByTestId('page-title')).toHaveText('Géneros')

    await page.getByRole('button', { name: 'Crear género' }).click()
    const modal = page.getByTestId('form-modal')
    await expect(modal).toBeVisible()
    await expect(page.getByTestId('form-modal-save')).toBeVisible()

    const caja = await modal.boundingBox()
    const ancho = page.viewportSize()?.width ?? 0
    expect(caja!.width).toBeLessThanOrEqual(ancho)
  })
})
