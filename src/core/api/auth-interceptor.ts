import axios from 'axios';
import { env } from '@/core/config/env';
import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from '@/core/config/constants';
import { readCookie } from '@/core/utils/cookies';
import { useAuthStore } from '@/core/auth/auth-store';
import type { AuthSessionPayload } from '@/core/auth/auth-session';
import type { ApiSuccessEnvelope } from './api-response';

/**
 * Instancia aislada solo para `/auth/refresh`, para no reentrar en el
 * interceptor de respuesta de `httpClient` (evita recursión infinita).
 */
const refreshClient = axios.create({ baseURL: env.apiBaseUrl, withCredentials: true });

let ongoingRefresh: Promise<string | null> | null = null;

/**
 * Renueva la sesión usando la cookie HttpOnly de refresh token. Deduplica
 * llamadas concurrentes: si dos peticiones expiran a la vez, solo se dispara
 * una renovación real.
 */
export function refreshSession(): Promise<string | null> {
  ongoingRefresh ??= performRefresh().finally(() => {
    ongoingRefresh = null;
  });

  return ongoingRefresh;
}

async function performRefresh(): Promise<string | null> {
  try {
    const csrfToken = readCookie(CSRF_COOKIE_NAME);

    const response = await refreshClient.post<ApiSuccessEnvelope<AuthSessionPayload>>(
      '/auth/refresh',
      { clientType: 'web' },
      csrfToken ? { headers: { [CSRF_HEADER_NAME]: csrfToken } } : undefined,
    );

    const session = response.data.data;

    useAuthStore.getState().setSession({
      accessToken: session.accessToken,
      user: session.user,
      sessionExpiresAt: session.sessionExpiresAt,
    });

    return session.accessToken;
  } catch {
    useAuthStore.getState().notifySessionExpired();
    return null;
  }
}
