import { z } from 'zod';

const createTaskValidationSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Title is required.' })
      .min(1, 'Title must not be empty.'),
    description: z
      .string({ required_error: 'Description is required.' })
      .min(1, 'Description must not be empty.'),
    dueDate: z.string({ required_error: 'Due date is required.' }),
  }),
});

const updateTaskValidationSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required.' }).optional(),
    description: z
      .string({ required_error: 'Description is required.' })
      .optional(),
    dueDate: z.string({ required_error: 'Due date is required.' }).optional(),
  }),
});

export const TaskValidations = {
  createTaskValidationSchema,
  updateTaskValidationSchema,
};
