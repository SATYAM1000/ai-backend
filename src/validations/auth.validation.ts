import { z } from 'zod';

const upsertGoogleUserSchema = z.object({
  providerAccountId: z.string().min(1, 'Provider account ID is required'),
  provider: z.literal('google'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  image: z.string().url({ message: 'Invalid image URL' }).optional(),
  role: z.enum(['user', 'admin']).default('user'),
});

export const authValidationSchemas = {
  upsertGoogleUserSchema: upsertGoogleUserSchema,
};
