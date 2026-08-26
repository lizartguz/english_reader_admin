import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '@/core/auth/auth-store';
import { AdminRoutes } from '@/core/config/constants';

/** Cierre de sesión tolerante (doc 01): limpia estado local aunque falle la llamada. */
export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((state) => state.clearSession);

  return async () => {
    try {
      await authApi.logout();
    } catch {
      // Se ignora: la sesión local se limpia igual.
    } finally {
      clearSession();
      queryClient.clear();
      navigate(AdminRoutes.Login, { replace: true });
    }
  };
}
