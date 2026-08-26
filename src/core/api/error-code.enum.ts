/**
 * Códigos de error estables, espejo de `ErrorCode` en
 * `english_reader_api/src/common/constants/error-codes.constants.ts`. Objeto
 * `as const` en vez de `enum` porque el proyecto compila con `erasableSyntaxOnly`.
 */
export const ErrorCode = {
  ValidationFailed: 'validation_failed',
  InvalidCredentials: 'invalid_credentials',
  AccountInactive: 'account_inactive',
  AccountBlocked: 'account_blocked',
  EmailNotVerified: 'email_not_verified',
  AccountLocked: 'account_locked',
  Unauthenticated: 'unauthenticated',
  TokenExpired: 'token_expired',
  TokenInvalid: 'token_invalid',
  CsrfInvalid: 'csrf_invalid',
  SessionExpired: 'session_expired',
  SessionInvalidated: 'session_invalidated',
  Forbidden: 'forbidden',
  NotFound: 'not_found',
  Conflict: 'conflict',
  BusinessRule: 'business_rule',
  RateLimited: 'rate_limited',
  PayloadTooLarge: 'payload_too_large',
  UnsupportedFileType: 'unsupported_file_type',
  ExternalProviderError: 'external_provider_error',
  ExternalProviderUnavailable: 'external_provider_unavailable',
  InternalError: 'internal_error',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

/** Códigos que indican que la sesión ya no es válida y debe limpiarse. */
export const SESSION_LOST_CODES: readonly ErrorCode[] = [
  ErrorCode.SessionExpired,
  ErrorCode.SessionInvalidated,
  ErrorCode.TokenExpired,
  ErrorCode.Unauthenticated,
];
