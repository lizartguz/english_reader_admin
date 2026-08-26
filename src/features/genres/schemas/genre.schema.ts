import { z } from 'zod';

export const genreSchema = z.object({
  code: z.string().min(1, 'El código es obligatorio.').max(50, 'El código no puede superar 50 caracteres.'),
  name: z.string().min(1, 'El nombre es obligatorio.').max(100, 'El nombre no puede superar 100 caracteres.'),
  description: z
    .string()
    .max(255, 'La descripción no puede superar 255 caracteres.')
    .optional()
    .or(z.literal('')),
  sortOrder: z.number().int('El orden debe ser un número entero.').min(0, 'El orden debe ser 0 o mayor.'),
  isActive: z.boolean(),
});

export type GenreFormValues = z.infer<typeof genreSchema>;
