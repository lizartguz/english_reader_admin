import { useState } from 'react';
import { Outlet } from 'react-router';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Sidebar, SidebarBrand, SidebarNav } from '@/core/ui/layout/Sidebar';
import { Header } from '@/core/ui/layout/Header';
import { Breadcrumbs } from '@/core/ui/layout/Breadcrumbs';
import { SessionExpiredModal } from '@/core/ui/feedback/SessionExpiredModal';
import { useAuthStore } from '@/core/auth/auth-store';
import { useLogout } from '@/features/auth/hooks/use-logout';
import { ChangePasswordModal } from '@/features/auth/components/ChangePasswordModal';

/** Plantilla administrativa (doc 01/03): sidebar + header + contenido. */
export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  return (
    <div className="flex min-h-svh bg-muted/20">
      <Sidebar collapsed={collapsed} />

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 gap-0 p-0" data-testid="sidebar-mobile">
          <SheetHeader className="sr-only">
            <SheetTitle>Menú de navegación</SheetTitle>
          </SheetHeader>
          <SidebarBrand />
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          user={user}
          onToggleSidebar={() => setCollapsed((value) => !value)}
          onOpenMobileMenu={() => setMobileOpen(true)}
          onLogout={logout}
          onChangePassword={() => setChangePasswordOpen(true)}
        />
        <main className="flex-1 space-y-4 p-4 sm:p-6">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>

      <ChangePasswordModal
        key={changePasswordOpen ? 'abierto' : 'cerrado'}
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
      />

      <SessionExpiredModal />
    </div>
  );
}
