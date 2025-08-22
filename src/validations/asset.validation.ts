import { z } from 'zod';
import path from 'path';
import { ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from '@/constants';

const getPresignedUrlSchema = z
  .object({
    fileName: z
      .string()
      .min(1, 'File name is required')
      .max(255, 'File name is too long')
      // eslint-disable-next-line no-control-regex
      .refine((fileName) => !/[<>:"/\\|?*\x00-\x1f]/.test(fileName), {
        message: 'File name contains invalid characters',
      })
      .refine((fileName) => ALLOWED_EXTENSIONS.includes(path.extname(fileName).toLowerCase()), {
        message: `File extension must be one of: ${ALLOWED_EXTENSIONS.join(', ')}`,
      })
      .refine(
        (fileName) =>
          !fileName.includes('..') && !fileName.startsWith('/') && !fileName.startsWith('.'),
        { message: 'Invalid file path' },
      ),

    mimeType: z.enum(ALLOWED_MIME_TYPES as [string, ...string[]], {
      message: `File type must be one of: ${ALLOWED_MIME_TYPES.join(', ')}`,
    }),

    fileSize: z
      .number()
      .int('File size must be an integer')
      .min(1, 'File size is required')
      .max(MAX_FILE_SIZE, 'File size is too large'),
  })
  .superRefine((data, ctx) => {
    const { fileName, mimeType } = data;
    const extension = path.extname(fileName).toLowerCase();

    const mimeExtensionMap: Record<string, string[]> = {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    };

    if (!mimeExtensionMap[mimeType]?.includes(extension)) {
      ctx.addIssue({
        path: ['mimeType'],
        code: z.ZodIssueCode.custom,
        message: 'File extension does not match MIME type',
      });
    }
  });

export const assetValidationSchemas = {
  getPresignedUrlSchema,
};

export type GetPresignedUrlBody = z.infer<typeof getPresignedUrlSchema>;
