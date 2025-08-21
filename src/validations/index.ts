export * from '@/validations/auth.validation';
export * from '@/validations/env.validation';
export * from '@/validations/workspace.validation';
export * from '@/validations/project.validation';
export * from '@/validations/asset.validation';
import { assetValidationSchemas } from '@/validations/asset.validation';
import { authValidationSchemas } from '@/validations/auth.validation';
import { envSchema } from '@/validations/env.validation';
import { projectValidationSchemas } from '@/validations/project.validation';
import { workspaceValidationSchemas } from '@/validations/workspace.validation';

export const validationSchema = {
  env: envSchema,
  auth: authValidationSchemas,
  workspace: workspaceValidationSchemas,
  project: projectValidationSchemas,
  assets: assetValidationSchemas,
};
