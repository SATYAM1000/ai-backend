import { workspaceControllers } from '@/controllers/workspace.controller';
import { middlewares } from '@/middlewares';
import { validationSchema } from '@/validations';
import { Router } from 'express';

export const workspaceRouter = Router();

workspaceRouter.get(
  '/:id/projects/latest',
  middlewares.authHandler,
  workspaceControllers.getLastEditProjectFromWorkspace,
);

workspaceRouter.post(
  '/',
  middlewares.authHandler,
  middlewares.validationHandler(validationSchema.workspace.createWorkspaceSchema),
  workspaceControllers.createNewWorkspace,
);

workspaceRouter.patch(
  '/:id',
  middlewares.authHandler,
  middlewares.validationHandler(validationSchema.workspace.updateWorkspaceSchema),
  workspaceControllers.updateExistingWorkspace,
);

workspaceRouter.delete('/:id', middlewares.authHandler, workspaceControllers.deleteWorkspace);

workspaceRouter.get('/', middlewares.authHandler, workspaceControllers.getUserWorkspaces);

workspaceRouter.get('/:id', middlewares.authHandler, workspaceControllers.getWorkspaceInfoById);
