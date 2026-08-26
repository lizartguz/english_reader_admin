import { AppErrorBoundary } from '@/core/ui/feedback/AppErrorBoundary';
import { AppProviders } from './providers/app-providers';
import { AppRoutes } from './router/routes';

export function App() {
  return (
    <AppErrorBoundary>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </AppErrorBoundary>
  );
}
