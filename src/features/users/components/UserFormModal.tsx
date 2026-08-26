import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { FormModal } from '@/core/ui/forms/FormModal';
import { FormField } from '@/core/ui/forms/FormField';
import { AppFeedback } from '@/core/ui/feedback/AppFeedback';
import { applyServerErrors } from '@/core/errors/error-mapper';
import { AdminMessages } from '@/core/config/constants';
import type { RoleCode } from '@/core/permissions/roles.enum';
import { buildUserSchema, type UserFormValues } from '../schemas/user.schema';
import { useCreateUser, useUpdateUser } from '../hooks/use-user-mutations';
import type { AdminUser } from '../types/user.types';

interface UserFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser | null;
  /** Rol asignado al crear. La edición no cambia roles: eso tiene su propio modal. */
  defaultRoleCode: RoleCode;
}

/**
 * Alta y edición de usuarios (doc 02/11). Al editar no se pide contraseña ni
 * rol: la API los expone en endpoints dedicados con sus propias reglas.
 */
export function UserFormModal({ open, onOpenChange, user, defaultRoleCode }: UserFormModalProps) {
  const isEditing = Boolean(user);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const saving = createMutation.isPending || updateMutation.isPending;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(buildUserSchema(isEditing)),
    defaultValues: {
      email: user?.email ?? '',
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      phoneNumber: user?.phoneNumber ?? '',
      password: '',
    },
  });

  function onSubmit(values: UserFormValues) {
    setGeneralError(null);
    const phoneNumber = values.phoneNumber || undefined;

    const mutation = isEditing
      ? updateMutation.mutateAsync({
          id: user!.id,
          payload: {
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber,
          },
        })
      : createMutation.mutateAsync({
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
          phoneNumber,
          roleCodes: [defaultRoleCode],
        });

    mutation
      .then(() => {
        AppFeedback.success(isEditing ? AdminMessages.UpdatedSuccess : AdminMessages.CreatedSuccess);
        onOpenChange(false);
      })
      .catch((error) => setGeneralError(applyServerErrors(error, form.setError)));
  }

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar usuario' : 'Nuevo usuario'}
      onSubmit={form.handleSubmit(onSubmit)}
      saving={saving}
      generalError={generalError}
    >
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Nombre" htmlFor="firstName" required error={form.formState.errors.firstName?.message}>
          <Input id="firstName" {...form.register('firstName')} />
        </FormField>
        <FormField label="Apellido" htmlFor="lastName" required error={form.formState.errors.lastName?.message}>
          <Input id="lastName" {...form.register('lastName')} />
        </FormField>
      </div>

      <FormField label="Correo electrónico" htmlFor="email" required error={form.formState.errors.email?.message}>
        <Input id="email" type="email" {...form.register('email')} />
      </FormField>

      <FormField
        label="Teléfono"
        htmlFor="phoneNumber"
        error={form.formState.errors.phoneNumber?.message}
        description="Opcional."
      >
        <Input id="phoneNumber" {...form.register('phoneNumber')} />
      </FormField>

      {!isEditing && (
        <FormField
          label="Contraseña"
          htmlFor="password"
          required
          error={form.formState.errors.password?.message}
          description="Mínimo 8 caracteres, con mayúscula, minúscula y número."
        >
          <Input id="password" type="password" autoComplete="new-password" {...form.register('password')} />
        </FormField>
      )}
    </FormModal>
  );
}
