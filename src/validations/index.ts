export * from './auth.validation';
export * from './env.validation';
export * from './workspace.validation';
import { authValidationSchemas } from './auth.validation';
import { envSchema } from './env.validation';
import { workspaceValidationSchemas } from './workspace.validation';

export const validationSchema = {
  env: envSchema,
  auth: authValidationSchemas,
  workspace: workspaceValidationSchemas,
};
