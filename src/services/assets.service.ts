import { env, s3Client } from '@/config';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const assetServices = {
  getPresignedUrl: async (key: string, mimeType: string) => {
    const command = new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: key,
      ContentType: mimeType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 30 });
    return uploadUrl;
  },
};
