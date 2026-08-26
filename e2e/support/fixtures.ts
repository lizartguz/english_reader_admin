import { test as base, type Browser, type BrowserContext, type Page } from '@playwright/test'
import { login } from './helpers'

/**
 * Sesiones compartidas por worker.
 *
 * La API limita las peticiones de autenticación (`THROTTLE_AUTH_LIMIT`, 10 por
 * minuto por defecto). Si cada prueba iniciara sesión por su cuenta, la suite
 * agotaría ese presupuesto y fallaría por rate limiting en vez de por defectos
 * reales. Aquí se inicia sesión una sola vez por rol y por worker; cada prueba
 * recibe una pestaña nueva sobre ese contexto, conservando su aislamiento de
 * interfaz sin repetir el login.
 */
type WorkerFixtures = {
  superAdminContext: BrowserContext
  adminContext: BrowserContext
}

type TestFixtures = {
  /** Pestaña autenticada como SUPER_ADMIN, ya en el dashboard. */
  superAdminPage: Page
  /** Pestaña autenticada como ADMIN, ya en el dashboard. */
  adminPage: Page
}

async function createAuthenticatedContext(browser: Browser, role: 'superAdmin' | 'admin') {
  // Viewport explícito: `browser.newContext()` no hereda el `device` del
  // proyecto. Las pruebas de viewport pequeño viven en `responsive.spec.ts`,
  // que usa la página estándar y sí respeta la emulación del proyecto `movil`.
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const page = await context.newPage()
  await login(page, role)
  await page.close()
  return context
}

/**
 * Abre una pestaña y espera a que la renovación silenciosa haya terminado.
 *
 * Cada carga completa dispara `POST /auth/refresh`, que **rota** el refresh
 * token. Si la pestaña se cerrara con esa petición en vuelo, el navegador no
 * guardaría la cookie nueva y la siguiente prueba enviaría un token ya rotado:
 * el backend lo trataría como reutilización y revocaría la sesión completa.
 * Esperar al dashboard renderizado garantiza que la rotación ya se persistió.
 */
async function openAuthenticatedPage(context: BrowserContext) {
  const page = await context.newPage()
  const refreshed = page.waitForResponse(
    (r) => r.url().includes('/auth/refresh') && r.request().method() === 'POST',
  )
  await page.goto('/admin/dashboard')
  await refreshed
  await page.getByTestId('page-title').waitFor({ state: 'visible' })
  return page
}

export const test = base.extend<TestFixtures, WorkerFixtures>({
  superAdminContext: [
    async ({ browser }, use) => {
      const context = await createAuthenticatedContext(browser, 'superAdmin')
      await use(context)
      await context.close()
    },
    { scope: 'worker' },
  ],

  adminContext: [
    async ({ browser }, use) => {
      const context = await createAuthenticatedContext(browser, 'admin')
      await use(context)
      await context.close()
    },
    { scope: 'worker' },
  ],

  superAdminPage: async ({ superAdminContext }, use) => {
    const page = await openAuthenticatedPage(superAdminContext)
    await use(page)
    await page.close()
  },

  adminPage: async ({ adminContext }, use) => {
    const page = await openAuthenticatedPage(adminContext)
    await use(page)
    await page.close()
  },
})

export { expect } from '@playwright/test'
