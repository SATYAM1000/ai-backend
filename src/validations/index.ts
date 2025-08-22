export * from '@/validations/auth.validation';
export * from '@/validations/env.validation';
export * from '@/validations/workspace.validation';
export * from '@/validations/project.validation';
export * from '@/validations/asset.validation';
export * from '@/validations/query.validation';
import { assetValidationSchemas } from '@/validations/asset.validation';
import { authValidationSchemas } from '@/validations/auth.validation';
import { envSchema } from '@/validations/env.validation';
import { projectValidationSchemas } from '@/validations/project.validation';
import { queryValidationSchemas } from '@/validations/query.validation';
import { workspaceValidationSchemas } from '@/validations/workspace.validation';

export const validationSchema = {
  env: envSchema,
  auth: authValidationSchemas,
  workspace: workspaceValidationSchemas,
  project: projectValidationSchemas,
  assets: assetValidationSchemas,
  query: queryValidationSchemas,
};
