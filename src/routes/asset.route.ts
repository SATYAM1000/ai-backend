import { Router } from 'express';
import { assetControllers } from '@/controllers';
import { middlewares } from '@/middlewares';
import { assetValidationSchemas } from '@/validations';

export const assetsRouter = Router();

assetsRouter.post(
  '/presign',
  middlewares.authHandler,
  middlewares.validationHandler(assetValidationSchemas.getPresignedUrlSchema),
  assetControllers.getPresignedUrl,
);
assetsRouter.post('/', middlewares.authHandler, assetControllers.createAsset);

assetsRouter.get('/:id', middlewares.authHandler, assetControllers.getAssetById);
assetsRouter.get(
  '/project/:projectId',
  middlewares.authHandler,
  assetControllers.getAllProjectAssets,
);
assetsRouter.get(
  '/workspace/:workspaceId',
  middlewares.authHandler,
  assetControllers.getAllWorkspaceAssets,
);

assetsRouter.patch('/:id', middlewares.authHandler, assetControllers.updateAsset);
assetsRouter.delete('/:id', middlewares.authHandler, assetControllers.deleteAsset);
