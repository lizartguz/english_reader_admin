import { z } from 'zod';

export const storySchema = z.object({
  title: z
    .string()
    .min(1, 'El título es obligatorio.')
    .max(200, 'El título no puede superar 200 caracteres.'),
  readingLevelId: z.string().min(1, 'Selecciona un nivel de lectura.'),
  author: z.string().max(150, 'El autor no puede superar 150 caracteres.').optional().or(z.literal('')),
  summary: z.string().max(2000, 'El resumen no puede superar 2000 caracteres.').optional().or(z.literal('')),
  content: z
    .string()
    .min(1, 'El contenido es obligatorio.')
    .max(200000, 'El contenido es demasiado extenso.'),
  // '' cuando no se especifica; se omite del payload en vez de enviarse como 0.
  estimatedReadingMinutes: z
    .string()
    .refine((value) => value === '' || (Number(value) >= 1 && Number.isInteger(Number(value))), {
      message: 'Los minutos deben ser un número entero de al menos 1.',
    }),
  genreIds: z.array(z.string()).max(10, 'No se pueden asignar más de 10 géneros.'),
});

export type StoryFormValues = z.infer<typeof storySchema>;
