import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  PORT: z.string(),
  MONGO_URI_MAIN: z.string().min(1, 'MONGO_URI_MAIN is required in env file'),
  MONGO_URI_LOGS: z.string().min(1, 'MONGO_URI_LOGS is required in env file'),
  NEXTAUTH_SECRET: z.string().min(1, 'NEXTAUTH_SECRET is required in env file'),
  NEXTAUTH_SALT: z.string().min(1, 'NEXTAUTH_SALT is required in env file'),
  FRONTEND_URL: z.string().min(1, 'FRONTEND_URL is required in env file'),
  REDIS_HOST: z.string().min(1, 'REDIS_HOST is required in env file'),
  REDIS_PORT: z.string().min(1, 'REDIS_PORT is required in env file'),
  REDIS_USERNAME: z.string().min(1, 'REDIS_USERNAME is required in env file'),
  REDIS_PASSWORD: z.string().min(1, 'REDIS_PASSWORD is required in env file'),
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required in env file'),
  FROM_EMAIL_ADDRESS: z.string().min(1, 'FROM_EMAIL_ADDRESS is required in env file'),
  AWS_ACCESS_KEY_ID: z.string().min(1, 'AWS_ACCESS_KEY_ID is required in env file'),
  AWS_SECRET_ACCESS_KEY: z.string().min(1, 'AWS_SECRET_ACCESS_KEY is required in env file'),
  AWS_S3_BUCKET_NAME: z.string().min(1, 'AWS_S3_BUCKET_NAME is required in env file'),
  AWS_S3_BUCKET_REGION: z.string().min(1, 'AWS_S3_BUCKET_REGION is required in env file'),
});
