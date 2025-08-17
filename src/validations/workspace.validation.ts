import { z } from 'zod';

const createWorkspaceSchema = z
  .object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
    description: z
      .string()
      .optional()
      .refine((val) => val === undefined || val.trim().length > 0, {
        message: 'Description cannot be empty if provided',
      }),
    logo: z.string().url({ message: 'Invalid image URL' }).optional(),
  })
  .strict();

export const updateWorkspaceSchema = z
  .object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters' }).optional(),
    description: z
      .string()
      .optional()
      .refine((val) => val === undefined || val.trim().length > 0, {
        message: 'Description cannot be empty if provided',
      }),
    logo: z.string().url({ message: 'Invalid image URL' }).optional(),
  })
  .strict();

export const workspaceValidationSchemas = {
  createWorkspaceSchema: createWorkspaceSchema,
  updateWorkspaceSchema: updateWorkspaceSchema,
};

export type CreateNewWorkspaceBody = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceBody = z.infer<typeof updateWorkspaceSchema>;
