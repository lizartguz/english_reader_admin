import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/core/auth/auth-store';
import { AdminMessages, AdminRoutes, SESSION_EXPIRED_COUNTDOWN_SECONDS } from '@/core/config/constants';

/**
 * Cuenta regresiva del modal de sesión expirada. Se monta solo mientras el
 * modal está abierto (ver `SessionExpiredModal`), así que su propio estado
 * arranca limpio en cada aparición sin necesitar un `useEffect` que lo reinicie.
 */
function SessionExpiredCountdown({ onExpire }: { onExpire: () => void }) {
  const queryClient = useQueryClient();
  const [secondsLeft, setSecondsLeft] = useState(SESSION_EXPIRED_COUNTDOWN_SECONDS);

  useEffect(() => {
    queryClient.clear();
    const interval = setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) onExpire();
  }, [secondsLeft, onExpire]);

  return (
    <DialogDescription>
      {AdminMessages.SessionExpiredDescription} Redirigiendo en {secondsLeft}…
    </DialogDescription>
  );
}

/**
 * Modal reutilizable de sesión expirada (doc 13): cuenta regresiva de 4 s,
 * limpieza de caché de TanStack Query y redirección a `/login`.
 */
export function SessionExpiredModal() {
  const open = useAuthStore((state) => state.sessionExpiredNotice);
  const dismiss = useAuthStore((state) => state.dismissSessionExpiredNotice);
  const navigate = useNavigate();

  function goToLogin() {
    dismiss();
    navigate(AdminRoutes.Login, { replace: true });
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent showCloseButton={false} className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{AdminMessages.SessionExpiredTitle}</DialogTitle>
          {open && <SessionExpiredCountdown onExpire={goToLogin} />}
        </DialogHeader>
        <Button type="button" onClick={goToLogin} className="w-full">
          {AdminMessages.SessionExpiredAction}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
