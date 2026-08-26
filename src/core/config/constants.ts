/** Rutas administrativas centralizadas. Nunca escribir strings de ruta sueltos. */
export const AdminRoutes = {
  Login: '/login',
  ForgotPassword: '/forgot-password',
  ResetPassword: '/reset-password',
  VerifyEmail: '/verify-email',
  Dashboard: '/admin/dashboard',
  Stories: '/admin/stories',
  ReadingLevels: '/admin/reading-levels',
  Genres: '/admin/genres',
  Dictionary: '/admin/dictionary',
  Translations: '/admin/translations',
  UsersClients: '/admin/users/clients',
  UsersAdmins: '/admin/users/admins',
  Roles: '/admin/roles',
  Permissions: '/admin/permissions',
  Vocabulary: '/admin/vocabulary',
  ReadingProgress: '/admin/reading-progress',
  Audit: '/admin/audit',
  SystemLogs: '/admin/system-logs',
} as const;

/** Textos reutilizables para mensajes de feedback (doc 12/13). */
export const AdminMessages = {
  SavedSuccess: 'Cambios guardados correctamente.',
  CreatedSuccess: 'Registro creado correctamente.',
  UpdatedSuccess: 'Registro actualizado correctamente.',
  DeletedSuccess: 'Registro eliminado correctamente.',
  GenericError: 'No se pudo completar la operación. Inténtalo nuevamente.',
  ApiUnavailable: 'No se pudo conectar con el servidor. Inténtalo nuevamente en unos minutos.',
  Forbidden: 'No tienes permisos para realizar esta acción.',
  AccessDeniedTitle: 'Acceso denegado',
  AccessDeniedDescription: 'No tienes permiso para acceder a esta sección.',
  SessionExpiredTitle: 'Sesión expirada',
  SessionExpiredDescription: 'Tu sesión finalizó. Serás redirigido al inicio de sesión.',
  SessionExpiredAction: 'Ir a iniciar sesión',
} as const;

/** Ventana de la cuenta regresiva del modal de sesión expirada, en segundos. */
export const SESSION_EXPIRED_COUNTDOWN_SECONDS = 4;

/** Paginación por defecto para tablas administrativas. */
export const DEFAULT_PAGE_SIZE = 20;

/** Tamaños de página ofrecidos al usuario. Deben respetar `PAGINATION.MaxLimit` de la API. */
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

/**
 * Idiomas destino de traducción. Hoy la API solo acepta español; la lista
 * existe para que agregar otro sea un cambio de una línea aquí y en la API.
 */
export const TARGET_LANGUAGES = [{ code: 'es', label: 'Español' }] as const;

/** Límites de archivos administrativos (doc 02/11). */
export const FILE_LIMITS = {
  imageMaxSizeMb: 10,
  imageAllowedTypes: ['image/png', 'image/jpeg', 'image/webp'],
  audioMaxSizeMb: 15,
  audioAllowedTypes: ['audio/mpeg', 'audio/mp4', 'audio/x-m4a'],
} as const;

/** Nombre de la cookie CSRF legible por JavaScript (doble envío). */
export const CSRF_COOKIE_NAME = 'er_csrf_token';
export const CSRF_HEADER_NAME = 'X-CSRF-Token';
