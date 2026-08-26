import { Outlet } from 'react-router';
import { GraduationCap } from 'lucide-react';

/** Layout centrado para login, recuperación y restablecimiento de contraseña. */
export function AuthLayout() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <GraduationCap className="size-8 text-primary" aria-hidden />
          <span className="font-heading text-lg font-semibold">English Reader Admin</span>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
