import { env, s3Client } from '@/config';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import mongoose from 'mongoose';

export const assetServices = {
  getPresignedUrl: async (
    key: string,
    mimeType: string,
    userId: mongoose.Types.ObjectId,
    fileName: string,
  ) => {
    const command = new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: key,
      ContentType: mimeType,
      Metadata: {
        'uploaded-by': userId.toString(),
        'original-filename': fileName,
        'upload-timestamp': Date.now().toString(),
      },
      ServerSideEncryption: 'AES256',
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 30 });
    return uploadUrl;
  },
};
