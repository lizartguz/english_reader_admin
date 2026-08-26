import axios, { AxiosHeaders, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import { env } from '@/core/config/env';
import { AdminMessages } from '@/core/config/constants';
import { useAuthStore } from '@/core/auth/auth-store';
import { ApiError, ApiUnavailableError } from './api-error';
import { refreshSession } from './auth-interceptor';
import type { ApiErrorEnvelope, ApiSuccessEnvelope, PaginatedResult } from './api-response';

/** Rutas de auth que nunca deben disparar un reintento de refresh. */
const AUTH_BYPASS_PATHS = ['/auth/login', '/auth/refresh', '/auth/logout'];

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

/**
 * Cliente HTTP centralizado. Todas las llamadas a `english_reader_api` deben
 * pasar por aquí (nunca `axios` directo desde componentes o features).
 */
export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
});

httpClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers = config.headers ?? new AxiosHeaders();
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    if (!error.response) {
      return Promise.reject(new ApiUnavailableError());
    }

    const original = error.config as RetryableConfig | undefined;
    const isBypassPath = AUTH_BYPASS_PATHS.some((path) => original?.url?.includes(path));

    if (error.response.status === 401 && original && !original._retried && !isBypassPath) {
      original._retried = true;
      const newToken = await refreshSession();

      if (newToken) {
        original.headers = original.headers ?? new AxiosHeaders();
        original.headers.set('Authorization', `Bearer ${newToken}`);
        return httpClient(original);
      }
    }

    const body = error.response.data as ApiErrorEnvelope | undefined;

    return Promise.reject(
      new ApiError(
        body?.message ?? AdminMessages.GenericError,
        body?.code ?? 'internal_error',
        body?.errors ?? [],
        error.response.status,
      ),
    );
  },
);

/** Ejecuta una petición y devuelve directamente `data`, ya desenvuelta. */
export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await httpClient.request<ApiSuccessEnvelope<T>>(config);
  return response.data.data;
}

/** Ejecuta una petición de listado y normaliza `data` + `meta.pagination`. */
export async function requestPaginated<T>(config: AxiosRequestConfig): Promise<PaginatedResult<T>> {
  const response = await httpClient.request<ApiSuccessEnvelope<T[]>>(config);
  const pagination = response.data.meta?.pagination;

  return {
    items: response.data.data,
    meta: pagination as PaginatedResult<T>['meta'],
  };
}
