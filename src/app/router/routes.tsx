import { Navigate, Route, Routes } from 'react-router';
import { AdminRoutes } from '@/core/config/constants';
import { AuthLayout } from '@/app/layouts/auth-layout';
import { AdminLayout } from '@/app/layouts/admin-layout';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage';
import { VerifyEmailPage } from '@/features/auth/pages/VerifyEmailPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { ReadingLevelsPage } from '@/features/reading-levels/pages/ReadingLevelsPage';
import { GenresPage } from '@/features/genres/pages/GenresPage';
import { SystemLogsPage } from '@/features/system-logs/pages/SystemLogsPage';
import { AuditPage } from '@/features/audit/pages/AuditPage';
import { VocabularyPage } from '@/features/vocabulary/pages/VocabularyPage';
import { ReadingProgressPage } from '@/features/reading-progress/pages/ReadingProgressPage';
import { RolesPage } from '@/features/roles/pages/RolesPage';
import { PermissionsPage } from '@/features/permissions/pages/PermissionsPage';
import { ClientUsersPage } from '@/features/users/pages/ClientUsersPage';
import { AdminUsersPage } from '@/features/users/pages/AdminUsersPage';
import { DictionaryPage } from '@/features/dictionary/pages/DictionaryPage';
import { TranslationsPage } from '@/features/translations/pages/TranslationsPage';
import { StoriesPage } from '@/features/stories/pages/StoriesPage';
import { NotFoundPage } from '@/core/ui/feedback/NotFoundState';
import { ProtectedRoute, RequireAccess } from './protected-route';
import { routeAccessRules } from './route-permissions';

function guarded(path: keyof typeof AdminRoutes, element: React.ReactNode) {
  return <RequireAccess access={routeAccessRules[AdminRoutes[path]]}>{element}</RequireAccess>;
}

/** Árbol de rutas de la aplicación (doc 09). */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path={AdminRoutes.Login} element={<LoginPage />} />
        <Route path={AdminRoutes.ForgotPassword} element={<ForgotPasswordPage />} />
        <Route path={AdminRoutes.ResetPassword} element={<ResetPasswordPage />} />
        <Route path={AdminRoutes.VerifyEmail} element={<VerifyEmailPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to={AdminRoutes.Dashboard} replace />} />
          <Route path="dashboard" element={guarded('Dashboard', <DashboardPage />)} />
          <Route path="stories" element={guarded('Stories', <StoriesPage />)} />
          <Route path="reading-levels" element={guarded('ReadingLevels', <ReadingLevelsPage />)} />
          <Route path="genres" element={guarded('Genres', <GenresPage />)} />
          <Route path="dictionary" element={guarded('Dictionary', <DictionaryPage />)} />
          <Route path="translations" element={guarded('Translations', <TranslationsPage />)} />
          <Route path="users/clients" element={guarded('UsersClients', <ClientUsersPage />)} />
          <Route path="users/admins" element={guarded('UsersAdmins', <AdminUsersPage />)} />
          <Route path="roles" element={guarded('Roles', <RolesPage />)} />
          <Route path="permissions" element={guarded('Permissions', <PermissionsPage />)} />
          <Route path="vocabulary" element={guarded('Vocabulary', <VocabularyPage />)} />
          <Route path="reading-progress" element={guarded('ReadingProgress', <ReadingProgressPage />)} />
          <Route path="audit" element={guarded('Audit', <AuditPage />)} />
          <Route path="system-logs" element={guarded('SystemLogs', <SystemLogsPage />)} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to={AdminRoutes.Dashboard} replace />} />

      {/* Una ruta desconocida se dice, no se disimula redirigiendo al inicio. */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
