import { expect, test } from '@playwright/test'
import { login } from './support/helpers'
import { SEED_USERS } from './support/credentials'

test.describe('Autenticación', () => {
  test('inicia sesión con credenciales válidas', async ({ page }) => {
    await login(page)
    await expect(page.getByTestId('nav-dashboard')).toBeVisible()
  })

  test('muestra un mensaje amigable con credenciales inválidas', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Correo electrónico').fill(SEED_USERS.superAdmin.email)
    await page.getByLabel('Contraseña').fill('ContraseñaIncorrecta9*')
    await page.getByRole('button', { name: 'Ingresar' }).click()

    await expect(page.getByRole('alert')).toBeVisible()
    // No debe filtrarse detalle técnico ni avanzar al panel.
    await expect(page.getByRole('alert')).not.toContainText(/sql|stack|exception/i)
    await expect(page).toHaveURL(/\/login$/)
  })

  test('valida los campos obligatorios en español', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: 'Ingresar' }).click()

    await expect(page.getByText('El correo es obligatorio.')).toBeVisible()
    await expect(page.getByText('La contraseña es obligatoria.')).toBeVisible()
  })

  test('redirige al login cuando no hay sesión', async ({ page }) => {
    await page.goto('/admin/stories')
    await page.waitForURL('**/login')
    await expect(page.getByRole('heading', { name: 'Iniciar sesión' })).toBeVisible()
  })

  test('mantiene la sesión al recargar la página', async ({ page }) => {
    await login(page)

    // El access token vive solo en memoria: al recargar debe recuperarse con
    // la cookie HttpOnly de refresh, sin volver a pedir credenciales.
    await page.reload()
    await expect(page).toHaveURL(/\/admin\/dashboard$/)
    await expect(page.getByTestId('page-title')).toHaveText('Dashboard')
  })

  test('cierra sesión y bloquea el acceso posterior', async ({ page }) => {
    await login(page)

    await page.getByRole('button', { name: /Super Administrador/ }).click()
    await page.getByRole('menuitem', { name: 'Cerrar sesión' }).click()
    await page.waitForURL('**/login')

    await page.goto('/admin/dashboard')
    await page.waitForURL('**/login')
  })

  test('no revela si un correo existe al recuperar contraseña', async ({ page }) => {
    await page.goto('/forgot-password')
    await page.getByLabel('Correo electrónico').fill('no.existe@englishreader.local')
    await page.getByRole('button', { name: 'Enviar enlace' }).click()

    await expect(page.getByText(/Si el correo existe/)).toBeVisible()
  })

  test('rechaza un enlace de verificación sin token', async ({ page }) => {
    await page.goto('/verify-email')
    await expect(page.getByText('Enlace no válido')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Enviar enlace nuevo' })).toBeVisible()
  })
})
