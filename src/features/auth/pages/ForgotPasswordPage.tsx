import { useState } from 'react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FormField } from '@/core/ui/forms/FormField';
import { ButtonLoader } from '@/core/ui/feedback/ButtonLoader';
import { toFriendlyMessage } from '@/core/errors/friendly-error';
import { AdminRoutes } from '@/core/config/constants';
import { authApi } from '../api/auth.api';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../schemas/auth.schema';

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const mutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => setSent(true),
  });

  function onSubmit(values: ForgotPasswordFormValues) {
    mutation.mutate(values.email);
  }

  if (sent) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-6 text-center">
          <CheckCircle2 className="size-10 text-emerald-500" aria-hidden />
          <p className="text-sm text-foreground">
            Si el correo existe y está registrado, recibirás un enlace para restablecer tu contraseña.
          </p>
          <Link to={AdminRoutes.Login} className="text-sm text-primary hover:underline">
            Volver a iniciar sesión
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle role="heading" aria-level={1}>Recuperar contraseña</CardTitle>
        <CardDescription>Te enviaremos un enlace para restablecerla.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
          <FormField label="Correo electrónico" htmlFor="email" required error={form.formState.errors.email?.message}>
            <Input id="email" type="email" autoComplete="username" {...form.register('email')} />
          </FormField>

          {mutation.isError && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              {toFriendlyMessage(mutation.error)}
            </p>
          )}

          <ButtonLoader type="submit" className="w-full" loading={mutation.isPending} loadingText="Enviando…">
            Enviar enlace
          </ButtonLoader>

          <Link to={AdminRoutes.Login} className="block text-center text-sm text-primary hover:underline">
            Volver a iniciar sesión
          </Link>
        </form>
      </CardContent>
    </Card>
  );
}
