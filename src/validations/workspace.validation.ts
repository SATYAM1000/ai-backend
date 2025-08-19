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

const updateWorkspaceSchema = z
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

const inviteMemberToWorkspaceSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    role: z.enum(['admin', 'viewer', 'editor', 'guest']).default('viewer'),
  })
  .strict();

export const workspaceValidationSchemas = {
  createWorkspaceSchema: createWorkspaceSchema,
  updateWorkspaceSchema: updateWorkspaceSchema,
  inviteMemberToWorkspaceSchema: inviteMemberToWorkspaceSchema,
};

export type CreateNewWorkspaceBody = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceBody = z.infer<typeof updateWorkspaceSchema>;
export type InviteMemberToWorkspaceBody = z.infer<typeof inviteMemberToWorkspaceSchema>;
