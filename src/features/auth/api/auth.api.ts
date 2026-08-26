import { request } from '@/core/api/api-client';
import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from '@/core/config/constants';
import { readCookie } from '@/core/utils/cookies';
import type { AuthSessionPayload } from '@/core/auth/auth-session';

function csrfHeaders() {
  const token = readCookie(CSRF_COOKIE_NAME);
  return token ? { [CSRF_HEADER_NAME]: token } : undefined;
}

export interface LoginPayload {
  email: string;
  password: string;
}

/** Servicios de autenticación. Todas las llamadas usan `clientType: "web"`. */
export const authApi = {
  login: (payload: LoginPayload) =>
    request<AuthSessionPayload>({
      method: 'POST',
      url: '/auth/login',
      data: { ...payload, clientType: 'web' },
    }),

  logout: () =>
    request<null>({
      method: 'POST',
      url: '/auth/logout',
      data: { clientType: 'web' },
      headers: csrfHeaders(),
    }),

  forgotPassword: (email: string) =>
    request<null>({ method: 'POST', url: '/auth/forgot-password', data: { email } }),

  resetPassword: (payload: { token: string; password: string }) =>
    request<null>({ method: 'POST', url: '/auth/reset-password', data: payload }),

  /**
   * Confirma el correo de una cuenta cliente. El enlace llega por correo y
   * apunta aquí porque el panel es el único frontend web del ecosistema
   * (la API lo configura en `EMAIL_VERIFICATION_URL`).
   */
  verifyEmail: (token: string) =>
    request<null>({ method: 'POST', url: '/auth/verify-email', data: { token } }),

  resendVerification: (email: string) =>
    request<null>({ method: 'POST', url: '/auth/resend-verification', data: { email } }),

  /** Cambia la contraseña de la propia cuenta autenticada. */
  changePassword: (payload: { currentPassword: string; newPassword: string }) =>
    request<null>({ method: 'POST', url: '/auth/change-password', data: payload }),
};
