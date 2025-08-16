import { authValidationSchemas } from './auth.validation';
import { envSchema } from './env.validation';

export const validationSchema = {
  env: envSchema,
  auth: authValidationSchemas,
};
