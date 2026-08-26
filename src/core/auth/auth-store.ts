import { create } from 'zustand';

/** Usuario autenticado, forma alineada con `AuthenticatedUserResponse` de la API. */
export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  status: string;
  phoneNumber: string | null;
  roles: string[];
  permissions: string[];
  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
}

export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

interface AuthState {
  status: AuthStatus;
  accessToken: string | null;
  user: AuthenticatedUser | null;
  sessionExpiresAt: string | null;
  /** true mientras se muestra el modal de sesión expirada con cuenta regresiva. */
  sessionExpiredNotice: boolean;
  setSession: (payload: {
    accessToken: string;
    user: AuthenticatedUser;
    sessionExpiresAt: string;
  }) => void;
  clearSession: () => void;
  markUnauthenticated: () => void;
  notifySessionExpired: () => void;
  dismissSessionExpiredNotice: () => void;
}

/**
 * Store de sesión en memoria. El access token nunca se persiste en
 * localStorage; se pierde a propósito al recargar la página y se recupera
 * mediante el refresh silencioso que hace `AuthProvider` al montar la app.
 */
export const useAuthStore = create<AuthState>((set) => ({
  status: 'checking',
  accessToken: null,
  user: null,
  sessionExpiresAt: null,
  sessionExpiredNotice: false,
  setSession: ({ accessToken, user, sessionExpiresAt }) =>
    set({
      status: 'authenticated',
      accessToken,
      user,
      sessionExpiresAt,
      sessionExpiredNotice: false,
    }),
  clearSession: () =>
    set({
      status: 'unauthenticated',
      accessToken: null,
      user: null,
      sessionExpiresAt: null,
    }),
  markUnauthenticated: () => set({ status: 'unauthenticated' }),
  notifySessionExpired: () =>
    set((state) => ({
      status: 'unauthenticated',
      accessToken: null,
      user: null,
      sessionExpiresAt: null,
      // Solo se muestra el modal si hubo una sesión activa; el chequeo inicial
      // de arranque no debe disparar el aviso de "sesión expirada".
      sessionExpiredNotice: state.status === 'authenticated',
    })),
  dismissSessionExpiredNotice: () => set({ sessionExpiredNotice: false }),
}));
