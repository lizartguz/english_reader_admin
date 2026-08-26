import { useEffect, type ReactNode } from 'react';
import { refreshSession } from '@/core/api/auth-interceptor';

/**
 * Al montar la app intenta recuperar la sesión mediante la cookie HttpOnly de
 * refresh (el access token nunca se persiste). Si falla, simplemente queda
 * `unauthenticated` sin mostrar el modal de sesión expirada (doc 04/13).
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    void refreshSession();
  }, []);

  return <>{children}</>;
}
