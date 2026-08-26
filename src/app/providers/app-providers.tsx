import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryProvider } from './query-provider';
import { AuthProvider } from './auth-provider';

/** Composición única de todos los providers de la aplicación. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <QueryProvider>
        <AuthProvider>
          <TooltipProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </TooltipProvider>
        </AuthProvider>
      </QueryProvider>
    </BrowserRouter>
  );
}
