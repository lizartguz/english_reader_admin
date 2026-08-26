/**
 * Catálogo de permisos, espejo exacto de `PermissionCode` en
 * `english_reader_api/src/common/enums/permission.enum.ts`.
 *
 * No se deben escribir strings de permisos sueltos en el resto del código.
 * Se usa un objeto `as const` en vez de `enum` porque el proyecto compila con
 * `erasableSyntaxOnly` (TS 6), que no permite `enum`.
 */
export const PermissionCode = {
  UsersRead: 'users.read',
  UsersCreate: 'users.create',
  UsersUpdate: 'users.update',
  UsersDelete: 'users.delete',
  UsersManageAdmins: 'users.manage_admins',

  RolesRead: 'roles.read',
  RolesCreate: 'roles.create',
  RolesUpdate: 'roles.update',
  RolesDelete: 'roles.delete',
  RolesAssign: 'roles.assign',
  PermissionsRead: 'permissions.read',

  StoriesRead: 'stories.read',
  StoriesCreate: 'stories.create',
  StoriesUpdate: 'stories.update',
  StoriesDelete: 'stories.delete',
  StoriesPublish: 'stories.publish',

  ReadingLevelsRead: 'reading_levels.read',
  ReadingLevelsCreate: 'reading_levels.create',
  ReadingLevelsUpdate: 'reading_levels.update',
  ReadingLevelsDelete: 'reading_levels.delete',

  GenresRead: 'genres.read',
  GenresCreate: 'genres.create',
  GenresUpdate: 'genres.update',
  GenresDelete: 'genres.delete',

  FilesRead: 'files.read',
  FilesUpload: 'files.upload',
  FilesDelete: 'files.delete',

  WordsRead: 'words.read',
  WordsCreate: 'words.create',
  WordsUpdate: 'words.update',
  WordsDelete: 'words.delete',
  WordsReview: 'words.review',

  TranslationsRead: 'translations.read',
  TranslationsCreate: 'translations.create',
  TranslationsUpdate: 'translations.update',
  TranslationsDelete: 'translations.delete',
  TranslationsReview: 'translations.review',

  VocabularyRead: 'vocabulary.read',
  ReadingProgressRead: 'reading_progress.read',

  AuditRead: 'audit.read',
  SystemLogsRead: 'system_logs.read',
} as const;

export type PermissionCode = (typeof PermissionCode)[keyof typeof PermissionCode];
