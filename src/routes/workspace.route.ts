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
