import type { AuthenticatedUser } from './auth-store';

/** Forma de `AuthSessionResponse` devuelta por `/auth/login` y `/auth/refresh`. */
export interface AuthSessionPayload {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  sessionExpiresAt: string;
  user: AuthenticatedUser;
}
