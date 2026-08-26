import { expect, type Page } from '@playwright/test'
import { SEED_USERS } from './credentials'

type SeedUserKey = keyof typeof SEED_USERS

/** Inicia sesión y espera a que el dashboard esté cargado. */
export async function login(page: Page, user: SeedUserKey = 'superAdmin') {
  const { email, password } = SEED_USERS[user]

  await page.goto('/login')
  await page.getByLabel('Correo electrónico').fill(email)
  await page.getByLabel('Contraseña').fill(password)
  await page.getByRole('button', { name: 'Ingresar' }).click()

  await page.waitForURL('**/admin/dashboard')
  await expect(page.getByTestId('page-title')).toHaveText('Dashboard')
}

/** Navega por el sidebar usando el `data-testid` estable del ítem. */
export async function navigateTo(page: Page, testId: string, expectedTitle: string) {
  await page.getByTestId(testId).click()
  await expect(page.getByTestId('page-title')).toHaveText(expectedTitle)
}

/** Fila de la tabla que contiene el texto indicado. */
export function rowWith(page: Page, text: string) {
  return page.getByTestId('data-table-row').filter({ hasText: text }).first()
}

/** Abre el dropdown de acciones de una fila y elige una opción. */
export async function runRowAction(page: Page, rowText: string, action: string) {
  await rowWith(page, rowText).getByTestId('row-actions').click()
  await page.getByRole('menuitem', { name: action }).click()
}

/** Espera el toast de éxito con el mensaje indicado. */
export async function expectSuccessToast(page: Page, message: string) {
  await expect(page.getByText(message)).toBeVisible()
}

/** Sufijo único para no chocar con datos de corridas anteriores. */
export function uniqueSuffix() {
  return Date.now().toString().slice(-6)
}
