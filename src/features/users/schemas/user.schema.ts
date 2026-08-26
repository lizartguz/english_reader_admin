import { z } from 'zod';

const passwordRules = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres.')
  .regex(/[a-z]/, 'La contraseña debe incluir una letra minúscula.')
  .regex(/[A-Z]/, 'La contraseña debe incluir una letra mayúscula.')
  .regex(/[0-9]/, 'La contraseña debe incluir un número.');

/**
 * Esquema de usuario según el modo del formulario.
 *
 * Al editar, la contraseña no se pide (la API tiene su propio flujo de
 * cambio de contraseña), así que el campo queda sin reglas. Ambas variantes
 * infieren el mismo tipo para que `useForm` no cambie de forma entre modos.
 */
export function buildUserSchema(isEditing: boolean) {
  return z.object({
    email: z
      .string()
      .min(1, 'El correo es obligatorio.')
      .email('El correo no tiene un formato válido.'),
    firstName: z
      .string()
      .min(2, 'El nombre debe tener al menos 2 caracteres.')
      .max(100, 'El nombre no puede superar 100 caracteres.'),
    lastName: z
      .string()
      .min(2, 'El apellido debe tener al menos 2 caracteres.')
      .max(100, 'El apellido no puede superar 100 caracteres.'),
    phoneNumber: z
      .string()
      .regex(/^[+]?[0-9\s-]{6,30}$/, 'El teléfono no tiene un formato válido.')
      .optional()
      .or(z.literal('')),
    password: isEditing ? z.string() : passwordRules,
  });
}

export type UserFormValues = z.infer<ReturnType<typeof buildUserSchema>>;
