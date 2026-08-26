import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'El correo es obligatorio.').email('El correo no tiene un formato válido.'),
  password: z.string().min(1, 'La contraseña es obligatoria.'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'El correo es obligatorio.').email('El correo no tiene un formato válido.'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const passwordRules = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres.')
  .regex(/[a-z]/, 'La contraseña debe incluir una letra minúscula.')
  .regex(/[A-Z]/, 'La contraseña debe incluir una letra mayúscula.')
  .regex(/[0-9]/, 'La contraseña debe incluir un número.');

export const resetPasswordSchema = z
  .object({
    password: passwordRules,
    confirmPassword: z.string().min(1, 'Confirma la nueva contraseña.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'La contraseña actual es obligatoria.'),
    newPassword: passwordRules,
    confirmPassword: z.string().min(1, 'Confirma la nueva contraseña.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'La nueva contraseña debe ser distinta de la actual.',
    path: ['newPassword'],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
