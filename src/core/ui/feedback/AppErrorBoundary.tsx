import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Último recurso ante un error de renderizado.
 *
 * Sin él, una excepción en cualquier componente desmonta todo el árbol y el
 * usuario ve una pantalla en blanco, sin pista de qué pasó ni cómo salir. El
 * detalle técnico va a la consola del navegador, nunca a la interfaz (doc 13).
 */
export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Error no controlado en la interfaz:', error, info.componentStack);
  }

  private handleReload = () => {
    window.location.assign('/');
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
        <AlertTriangle className="size-12 text-destructive/70" aria-hidden />
        <div className="space-y-1">
          <p className="text-base font-medium text-foreground">Ocurrió un problema inesperado</p>
          <p className="text-sm text-muted-foreground">
            No se pudo mostrar esta sección. Vuelve a cargar el panel e inténtalo nuevamente.
          </p>
        </div>
        <Button onClick={this.handleReload}>Volver al inicio</Button>
      </div>
    );
  }
}
