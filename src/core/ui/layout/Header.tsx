import { KeyRound, LogOut, Menu, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { AuthenticatedUser } from '@/core/auth/auth-store';

interface HeaderProps {
  user: AuthenticatedUser | null;
  onToggleSidebar: () => void;
  onOpenMobileMenu: () => void;
  onLogout: () => void;
  onChangePassword: () => void;
}

function initials(user: AuthenticatedUser | null): string {
  if (!user) return '?';
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
}

/** Barra superior: toggle de sidebar, drawer móvil y menú de usuario. */
export function Header({
  user,
  onToggleSidebar,
  onOpenMobileMenu,
  onLogout,
  onChangePassword,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b bg-background px-3 sm:px-4">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" className="md:hidden" onClick={onOpenMobileMenu}>
          <Menu />
          <span className="sr-only">Abrir menú</span>
        </Button>
        <Button variant="ghost" size="icon-sm" className="hidden md:inline-flex" onClick={onToggleSidebar}>
          <PanelLeft />
          <span className="sr-only">Colapsar menú</span>
        </Button>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" className="gap-2 px-1.5">
              <Avatar size="sm">
                <AvatarFallback>{initials(user)}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">{user?.fullName}</span>
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-56">
          {/* Base UI exige que la etiqueta viva dentro de un grupo: fuera de
              él lanza `MenuGroupContext is missing` y tumba el menú entero. */}
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-medium">{user?.fullName}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onChangePassword}>
            <KeyRound /> Cambiar contraseña
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onLogout}>
            <LogOut /> Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
