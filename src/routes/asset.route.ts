import { assetControllers } from '@/controllers/assets.controller';
import { middlewares } from '@/middlewares';
import { Router } from 'express';

export const assetsRouter = Router();

assetsRouter.post('/presign', middlewares.authHandler, assetControllers.getPresignedUrl);
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
