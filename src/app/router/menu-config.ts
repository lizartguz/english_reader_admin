import {
  BookOpen,
  BookText,
  FileClock,
  Gauge,
  Languages,
  ScrollText,
  Shield,
  ShieldCheck,
  Tags,
  Users,
  UserCog,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AdminRoutes } from '@/core/config/constants';
import type { RouteAccessRule } from './route-permissions';
import { routeAccessRules } from './route-permissions';

export interface MenuItem {
  label: string;
  path: string;
  icon: LucideIcon;
  access: RouteAccessRule;
}

export interface MenuGroup {
  label?: string;
  items: MenuItem[];
}

/** Sidebar administrativo (doc 03/09), construido desde configuración central. */
export const menuGroups: MenuGroup[] = [
  {
    items: [
      { label: 'Dashboard', path: AdminRoutes.Dashboard, icon: Gauge, access: routeAccessRules[AdminRoutes.Dashboard] },
    ],
  },
  {
    label: 'Contenido',
    items: [
      { label: 'Historias', path: AdminRoutes.Stories, icon: BookOpen, access: routeAccessRules[AdminRoutes.Stories] },
      { label: 'Niveles de lectura', path: AdminRoutes.ReadingLevels, icon: ScrollText, access: routeAccessRules[AdminRoutes.ReadingLevels] },
      { label: 'Géneros', path: AdminRoutes.Genres, icon: Tags, access: routeAccessRules[AdminRoutes.Genres] },
    ],
  },
  {
    label: 'Diccionario',
    items: [
      { label: 'Palabras', path: AdminRoutes.Dictionary, icon: BookText, access: routeAccessRules[AdminRoutes.Dictionary] },
      { label: 'Traducciones', path: AdminRoutes.Translations, icon: Languages, access: routeAccessRules[AdminRoutes.Translations] },
    ],
  },
  {
    label: 'Usuarios',
    items: [
      { label: 'Clientes', path: AdminRoutes.UsersClients, icon: Users, access: routeAccessRules[AdminRoutes.UsersClients] },
      { label: 'Administradores', path: AdminRoutes.UsersAdmins, icon: UserCog, access: routeAccessRules[AdminRoutes.UsersAdmins] },
    ],
  },
  {
    label: 'Seguridad',
    items: [
      { label: 'Roles', path: AdminRoutes.Roles, icon: Shield, access: routeAccessRules[AdminRoutes.Roles] },
      { label: 'Permisos', path: AdminRoutes.Permissions, icon: ShieldCheck, access: routeAccessRules[AdminRoutes.Permissions] },
    ],
  },
  {
    label: 'Aprendizaje',
    items: [
      { label: 'Vocabulario', path: AdminRoutes.Vocabulary, icon: Languages, access: routeAccessRules[AdminRoutes.Vocabulary] },
      { label: 'Progreso de lectura', path: AdminRoutes.ReadingProgress, icon: Gauge, access: routeAccessRules[AdminRoutes.ReadingProgress] },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { label: 'Auditoría', path: AdminRoutes.Audit, icon: FileClock, access: routeAccessRules[AdminRoutes.Audit] },
      { label: 'Logs del sistema', path: AdminRoutes.SystemLogs, icon: FileClock, access: routeAccessRules[AdminRoutes.SystemLogs] },
    ],
  },
];
