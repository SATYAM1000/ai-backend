export * from './auth.validation';
export * from './env.validation';
export * from './workspace.validation';
export * from './project.validation';
import { authValidationSchemas } from './auth.validation';
import { envSchema } from './env.validation';
import { projectValidationSchemas } from './project.validation';
import { workspaceValidationSchemas } from './workspace.validation';

export const validationSchema = {
  env: envSchema,
  auth: authValidationSchemas,
  workspace: workspaceValidationSchemas,
  project: projectValidationSchemas,
};
