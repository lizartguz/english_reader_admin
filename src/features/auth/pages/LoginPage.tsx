import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FormField } from '@/core/ui/forms/FormField';
import { ButtonLoader } from '@/core/ui/feedback/ButtonLoader';
import { AppFeedback } from '@/core/ui/feedback/AppFeedback';
import { applyServerErrors } from '@/core/errors/error-mapper';
import { AdminRoutes } from '@/core/config/constants';
import { useAuthStore } from '@/core/auth/auth-store';
import { authApi } from '../api/auth.api';
import { loginSchema, type LoginFormValues } from '../schemas/auth.schema';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const status = useAuthStore((state) => state.status);
  const setSession = useAuthStore((state) => state.setSession);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (status === 'authenticated') {
      const from = (location.state as { from?: Location })?.from?.pathname ?? AdminRoutes.Dashboard;
      navigate(from, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (session) => {
      setSession(session);
      AppFeedback.success('Sesión iniciada correctamente.');
    },
    onError: (error) => {
      setGeneralError(applyServerErrors(error, form));
    },
  });

  function onSubmit(values: LoginFormValues) {
    setGeneralError(null);
    mutation.mutate(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle role="heading" aria-level={1}>Iniciar sesión</CardTitle>
        <CardDescription>Ingresa tus credenciales administrativas.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
          <FormField label="Correo electrónico" htmlFor="email" required error={form.formState.errors.email?.message}>
            <Input id="email" type="email" autoComplete="username" {...form.register('email')} />
          </FormField>
          <FormField label="Contraseña" htmlFor="password" required error={form.formState.errors.password?.message}>
            <Input id="password" type="password" autoComplete="current-password" {...form.register('password')} />
          </FormField>

          {generalError && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              {generalError}
            </p>
          )}

          <div className="flex justify-end">
            <Link to={AdminRoutes.ForgotPassword} className="text-sm text-primary hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <ButtonLoader type="submit" className="w-full" loading={mutation.isPending} loadingText="Ingresando…">
            Ingresar
          </ButtonLoader>
        </form>
      </CardContent>
    </Card>
  );
}
