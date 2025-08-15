import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  PORT: z.string(),
  MONGO_URI_MAIN: z.string().min(1, 'MONGO_URI_MAIN is required in env file'),
  MONGO_URI_LOGS: z.string().min(1, 'MONGO_URI_LOGS is required in env file'),
});
