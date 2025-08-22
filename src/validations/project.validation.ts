import { z } from 'zod';
const createNewProjectSchema = z.object({
  workspaceId: z.string().min(1, 'Workspace ID is required'),
  name: z.string().min(3, 'Name must be at least 3 characters').max(255, 'Name is too long'),
  description: z
    .string()
    .min(3, 'Description must be at least 3 characters')
    .max(1000, 'Description is too long')
    .optional(),
  thumbnailUrl: z.string().url('Thumbnail must be a valid URL').optional(),
});

export const projectValidationSchemas = {
  createNewProjectSchema: createNewProjectSchema,
};

export type CreateNewProjectBody = z.infer<typeof createNewProjectSchema>;
