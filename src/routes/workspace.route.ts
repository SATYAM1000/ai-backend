import { workspaceControllers } from '@/controllers/workspace.controller';
import { middlewares } from '@/middlewares';
import { Router } from 'express';

export const workspaceRouter = Router();

workspaceRouter.get(
  '/:id/projects/latest',
  middlewares.authHandler,
  workspaceControllers.getLastEditProjectFromWorkspace,
);
