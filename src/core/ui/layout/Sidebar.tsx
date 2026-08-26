import { NavLink } from 'react-router';
import { GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePermissions } from '@/core/auth/permission-checker';
import { menuGroups } from '@/app/router/menu-config';

/** Contenido de navegación, reutilizado en el sidebar de escritorio y el drawer móvil. */
export function SidebarNav({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const { hasAnyPermission, hasAnyRole } = usePermissions();

  return (
    <nav className="flex flex-1 flex-col gap-4 overflow-y-auto px-2 py-4">
      {menuGroups.map((group, index) => {
        const visibleItems = group.items.filter(
          (item) => hasAnyPermission(item.access.permissions ?? []) && hasAnyRole(item.access.roles ?? []),
        );

        if (visibleItems.length === 0) return null;

        return (
          <div key={group.label ?? `group-${index}`} className="space-y-1">
            {group.label && !collapsed && (
              <p className="px-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {group.label}
              </p>
            )}
            {visibleItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                data-testid={`nav-${item.path.replace(/^\/admin\//, '').replace(/\//g, '-')}`}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    collapsed && 'justify-center px-2',
                  )
                }
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="size-4 shrink-0" aria-hidden />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            ))}
          </div>
        );
      })}
    </nav>
  );
}

/** Marca/encabezado del sidebar, compartido entre escritorio y móvil. */
export function SidebarBrand({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex h-14 items-center gap-2 border-b px-4">
      <GraduationCap className="size-5 shrink-0 text-primary" aria-hidden />
      {!collapsed && <span className="font-heading text-sm font-semibold">English Reader Admin</span>}
    </div>
  );
}

/** Sidebar fijo de escritorio, colapsable a solo iconos. */
export function Sidebar({ collapsed }: { collapsed: boolean }) {
  return (
    <aside
      data-testid="sidebar-desktop"
      className={cn(
        'sticky top-0 hidden h-svh shrink-0 flex-col border-r bg-card transition-all md:flex',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      <SidebarBrand collapsed={collapsed} />
      <SidebarNav collapsed={collapsed} />
    </aside>
  );
}
