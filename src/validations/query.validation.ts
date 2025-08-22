import { z } from 'zod';

const createNewQuerySchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  prompt: z.string().min(1, 'User prompt is required'),
  attachments: z.array(z.string()).optional(),
});

export const queryValidationSchemas = {
  createNewQuerySchema: createNewQuerySchema,
};

export type CreateNewQueryBody = z.infer<typeof createNewQuerySchema>;
