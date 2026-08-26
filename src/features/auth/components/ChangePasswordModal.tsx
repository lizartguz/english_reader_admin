import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { FormModal } from '@/core/ui/forms/FormModal';
import { FormField } from '@/core/ui/forms/FormField';
import { AppFeedback } from '@/core/ui/feedback/AppFeedback';
import { applyServerErrors } from '@/core/errors/error-mapper';
import { authApi } from '../api/auth.api';
import { changePasswordSchema, type ChangePasswordFormValues } from '../schemas/auth.schema';

/**
 * Cambio de contraseña de la cuenta autenticada.
 *
 * La API revoca las demás sesiones al cambiarla, así que se avisa al usuario
 * en vez de dejar que lo descubra al quedar desconectado en otro dispositivo.
 */
export function ChangePasswordModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [generalError, setGeneralError] = useState<string | null>(null);

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const mutation = useMutation({ mutationFn: authApi.changePassword });

  function onSubmit(values: ChangePasswordFormValues) {
    setGeneralError(null);
    mutation
      .mutateAsync({ currentPassword: values.currentPassword, newPassword: values.newPassword })
      .then(() => {
        AppFeedback.success({
          title: 'Contraseña actualizada correctamente.',
          description: 'Las sesiones abiertas en otros dispositivos se cerraron.',
        });
        onOpenChange(false);
      })
      .catch((error) => setGeneralError(applyServerErrors(error, form.setError)));
  }

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Cambiar contraseña"
      description="Por seguridad, se cerrarán tus sesiones en otros dispositivos."
      onSubmit={form.handleSubmit(onSubmit)}
      saving={mutation.isPending}
      generalError={generalError}
      saveLabel="Cambiar contraseña"
    >
      <FormField
        label="Contraseña actual"
        htmlFor="currentPassword"
        required
        error={form.formState.errors.currentPassword?.message}
      >
        <Input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          {...form.register('currentPassword')}
        />
      </FormField>

      <FormField
        label="Nueva contraseña"
        htmlFor="newPassword"
        required
        error={form.formState.errors.newPassword?.message}
        description="Mínimo 8 caracteres, con mayúscula, minúscula y número."
      >
        <Input id="newPassword" type="password" autoComplete="new-password" {...form.register('newPassword')} />
      </FormField>

      <FormField
        label="Confirmar nueva contraseña"
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
    </FormModal>
  );
}
