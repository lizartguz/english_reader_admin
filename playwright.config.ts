import { defineConfig, devices } from '@playwright/test'

const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:5173'

/**
 * Pruebas E2E del panel administrativo (doc 06).
 *
 * Requieren la API de `english_reader_api` corriendo en el puerto 3000 con la
 * base sembrada: las pruebas usan los usuarios semilla y datos reales, no
 * mocks, para validar también los contratos.
 *
 * La API debe correr con `THROTTLE_AUTH_LIMIT` alto (100 en el `.env` de
 * desarrollo). Con el valor de producción (10 por minuto) la propia suite se
 * autolimita: los inicios de sesión empiezan a recibir 429 y las pruebas
 * fallan por rate limiting en vez de por defectos reales.
 */
export default defineConfig({
  testDir: './e2e',
  // Los datos son compartidos (una sola base), así que los archivos no corren
  // en paralelo: evitaría carreras entre altas y bajas de los mismos módulos.
  workers: 1,
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  timeout: 45_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: BASE_URL,
    locale: 'es-ES',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    // Las pruebas responsive solo tienen sentido con viewport de teléfono.
    { name: 'escritorio', use: { ...devices['Desktop Chrome'] }, testIgnore: /responsive\.spec\.ts/ },
    { name: 'movil', use: { ...devices['Pixel 7'] }, testMatch: /responsive\.spec\.ts/ },
  ],
  webServer: {
    command: 'npm run dev',
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 60_000,
  },
})
