import { Fragment } from 'react';
import { Link, useLocation } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { AdminRoutes } from '@/core/config/constants';
import { menuGroups } from '@/app/router/menu-config';

/**
 * Migas de pan del panel (doc 03/08).
 *
 * La jerarquía se deriva del propio menú: el grupo del sidebar es el nivel
 * intermedio y el ítem activo el último. Así no hay que mantener un árbol de
 * rutas aparte que se desincronice del menú.
 */
export function Breadcrumbs() {
  const { pathname } = useLocation();

  const grupo = menuGroups.find((group) => group.items.some((item) => item.path === pathname));
  const item = grupo?.items.find((entry) => entry.path === pathname);

  // El dashboard es la raíz: no necesita migas encima de su propio título.
  if (!item || item.path === AdminRoutes.Dashboard) return null;

  const trozos = [
    { label: 'Dashboard', path: AdminRoutes.Dashboard },
    ...(grupo?.label ? [{ label: grupo.label, path: null }] : []),
    { label: item.label, path: null },
  ];

  return (
    <nav aria-label="Ruta de navegación" data-testid="breadcrumbs">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        {trozos.map((trozo, index) => {
          const esUltimo = index === trozos.length - 1;

          return (
            <Fragment key={`${trozo.label}-${index}`}>
              {index > 0 && <ChevronRight className="size-3 shrink-0" aria-hidden />}
              <li>
                {trozo.path && !esUltimo ? (
                  <Link to={trozo.path} className="hover:text-foreground hover:underline">
                    {trozo.label}
                  </Link>
                ) : (
                  <span aria-current={esUltimo ? 'page' : undefined} className={esUltimo ? 'text-foreground' : undefined}>
                    {trozo.label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
