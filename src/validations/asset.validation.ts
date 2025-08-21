import { z } from 'zod';

const getPresignedUrlSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  mimeType: z.string().min(1, 'File type is required'),
});

export const assetValidationSchemas = {
  getPresignedUrlSchema: getPresignedUrlSchema,
};

export type GetPresignedUrlBody = z.infer<typeof getPresignedUrlSchema>;
