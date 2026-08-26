import { request } from '@/core/api/api-client';
import type { Permission } from '../types/permission.types';

/** El catálogo de permisos no está paginado: son ~41 registros fijos. */
export const permissionsApi = {
  list: (): Promise<Permission[]> => request<Permission[]>({ url: '/admin/permissions' }),
};
