import { z } from 'zod';

const createNewQuerySchema = z.object({
  workspaceId: z.string().min(1, 'Workspace ID is required'),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(3, 'Description must be at least 3 characters').optional(),
  thumbnailUrl: z.string().url('Thumbnail must be a valid URL').optional(),
  projectId: z.string().min(1, 'Project ID is required'),
});
