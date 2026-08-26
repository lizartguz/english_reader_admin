import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FormField } from '@/core/ui/forms/FormField';
import { ButtonLoader } from '@/core/ui/feedback/ButtonLoader';
import { AppFeedback } from '@/core/ui/feedback/AppFeedback';
import { toFriendlyMessage } from '@/core/errors/friendly-error';
import { AdminRoutes } from '@/core/config/constants';
import { authApi } from '../api/auth.api';
import { resetPasswordSchema, type ResetPasswordFormValues } from '../schemas/auth.schema';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';
  const [generalError, setGeneralError] = useState<string | null>(null);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const mutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      AppFeedback.success({
        title: 'Contraseña actualizada',
        description: 'Ya puedes iniciar sesión con tu nueva contraseña.',
      });
      navigate(AdminRoutes.Login, { replace: true });
    },
    onError: (error) => setGeneralError(toFriendlyMessage(error)),
  });

  function onSubmit(values: ResetPasswordFormValues) {
    setGeneralError(null);
    mutation.mutate({ token, password: values.password });
  }

  if (!token) {
    return (
      <Card>
        <CardContent className="space-y-3 py-6 text-center">
          <p className="text-sm text-foreground">
            El enlace de recuperación no es válido o ya expiró. Solicita uno nuevo.
          </p>
          <Link to={AdminRoutes.ForgotPassword} className="text-sm text-primary hover:underline">
            Solicitar nuevo enlace
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle role="heading" aria-level={1}>Restablecer contraseña</CardTitle>
        <CardDescription>Define una nueva contraseña para tu cuenta.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
          <FormField
            label="Nueva contraseña"
            htmlFor="password"
            required
            error={form.formState.errors.password?.message}
          >
            <Input id="password" type="password" autoComplete="new-password" {...form.register('password')} />
          </FormField>
          <FormField
            label="Confirmar contraseña"
            htmlFor="confirmPassword"
            required
            error={form.formState.errors.confirmPassword?.message}
          >
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...form.register('confirmPassword')}
            />
          </FormField>

          {generalError && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              {generalError}
            </p>
          )}

          <ButtonLoader type="submit" className="w-full" loading={mutation.isPending} loadingText="Guardando…">
            Restablecer contraseña
          </ButtonLoader>
        </form>
      </CardContent>
    </Card>
  );
}
