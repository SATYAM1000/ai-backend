import { validationSchema } from '@/validations';
import dotenv from 'dotenv';
import path from 'path';

const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
const envPath = path.resolve(process.cwd(), envFile);

dotenv.config({ path: envPath });

const _env = validationSchema.env.safeParse(process.env);

if (!_env.success) {
  process.exit(1);
}

export const env = _env.data;
