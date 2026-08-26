import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FormField } from '@/core/ui/forms/FormField';
import { ButtonLoader } from '@/core/ui/feedback/ButtonLoader';
import { FullBlockLoader } from '@/core/ui/feedback/CircularLoader';
import { toFriendlyMessage } from '@/core/errors/friendly-error';
import { AdminRoutes } from '@/core/config/constants';
import { authApi } from '../api/auth.api';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../schemas/auth.schema';

/** Formulario de reenvío, mostrado solo si el token falló o no llegó. */
function ResendVerificationForm() {
  const [sent, setSent] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const mutation = useMutation({
    mutationFn: authApi.resendVerification,
    onSuccess: () => setSent(true),
  });

  if (sent) {
    return (
      <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
        Si la cuenta existe y está pendiente de confirmación, recibirás un nuevo correo.
      </p>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit((values) => mutation.mutate(values.email))}
      noValidate
      className="space-y-3 border-t pt-4 text-left"
    >
      <FormField
        label="Reenviar confirmación"
        htmlFor="email"
        error={form.formState.errors.email?.message}
        description="Escribe tu correo y te enviaremos un enlace nuevo."
      >
        <Input id="email" type="email" autoComplete="username" {...form.register('email')} />
      </FormField>

      {mutation.isError && (
        <p className="text-sm text-destructive" role="alert">
          {toFriendlyMessage(mutation.error)}
        </p>
      )}

      <ButtonLoader type="submit" className="w-full" loading={mutation.isPending} loadingText="Enviando…">
        Enviar enlace nuevo
      </ButtonLoader>
    </form>
  );
}

/**
 * Confirma el correo de una cuenta cliente a partir del token del enlace.
 * Es una ruta pública: quien llega aquí todavía no tiene sesión.
 */
export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  // El token es de un solo uso: este guard evita que el doble montaje de
  // StrictMode en desarrollo lo consuma dos veces y falle la segunda.
  const requestedRef = useRef(false);

  const mutation = useMutation({ mutationFn: authApi.verifyEmail });
  const { mutate } = mutation;

  useEffect(() => {
    if (!token || requestedRef.current) return;
    requestedRef.current = true;
    mutate(token);
  }, [token, mutate]);

  const loginLink = (
    <Link to={AdminRoutes.Login} className="text-sm text-primary hover:underline">
      Ir a iniciar sesión
    </Link>
  );

  if (!token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle role="heading" aria-level={1}>Enlace no válido</CardTitle>
          <CardDescription>El enlace de confirmación está incompleto o ya expiró.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <ResendVerificationForm />
          {loginLink}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-4 py-6 text-center">
        {mutation.isPending && <FullBlockLoader label="Confirmando tu correo…" />}

        {mutation.isSuccess && (
          <>
            <CheckCircle2 className="mx-auto size-10 text-emerald-500" aria-hidden />
            <div className="space-y-1">
              <p className="text-base font-medium text-foreground">Correo confirmado</p>
              <p className="text-sm text-muted-foreground">
                Tu cuenta quedó activa. Ya puedes iniciar sesión en la aplicación.
              </p>
            </div>
            {loginLink}
          </>
        )}

        {mutation.isError && (
          <>
            <XCircle className="mx-auto size-10 text-destructive" aria-hidden />
            <div className="space-y-1">
              <p className="text-base font-medium text-foreground">No se pudo confirmar tu correo</p>
              <p className="text-sm text-muted-foreground">{toFriendlyMessage(mutation.error)}</p>
            </div>
            <ResendVerificationForm />
            {loginLink}
          </>
        )}
      </CardContent>
    </Card>
  );
}
