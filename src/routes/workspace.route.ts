import { EWorkspacePermissions } from '@/@types';
import { workspaceControllers } from '@/controllers/workspace.controller';
import { middlewares } from '@/middlewares';
import { validationSchema } from '@/validations';
import { Router } from 'express';

export const workspaceRouter = Router();

workspaceRouter.get(
  '/:id/projects/latest',
  middlewares.authHandler,
  middlewares.workspacePermissionHandler(EWorkspacePermissions.VIEW_PROJECT),
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
  middlewares.workspacePermissionHandler(EWorkspacePermissions.MANAGE_WORKSPACE),
  middlewares.validationHandler(validationSchema.workspace.updateWorkspaceSchema),
  workspaceControllers.updateExistingWorkspace,
);

workspaceRouter.delete(
  '/:id',
  middlewares.authHandler,
  middlewares.workspacePermissionHandler(EWorkspacePermissions.DELETE_WORKSPACE),
  workspaceControllers.deleteWorkspace,
);

workspaceRouter.get('/', middlewares.authHandler, workspaceControllers.getUserWorkspaces);

workspaceRouter.get(
  '/:id',
  middlewares.authHandler,
  middlewares.workspacePermissionHandler(EWorkspacePermissions.VIEW_WORKSPACE),
  workspaceControllers.getWorkspaceInfoById,
);

workspaceRouter.get(
  '/:id/members',
  middlewares.authHandler,
  middlewares.workspacePermissionHandler(EWorkspacePermissions.MANAGE_WORKSPACE),
  workspaceControllers.getWorkspaceMembers,
);

workspaceRouter.get(
  '/:id/projects',
  middlewares.authHandler,
  middlewares.workspacePermissionHandler(EWorkspacePermissions.VIEW_WORKSPACE),
  workspaceControllers.getWorkspaceProjects,
);

workspaceRouter.post(
  '/:id/invites',
  middlewares.authHandler,
  middlewares.workspacePermissionHandler(EWorkspacePermissions.INVITE_MEMBERS),
  middlewares.validationHandler(validationSchema.workspace.inviteMemberToWorkspaceSchema),
  workspaceControllers.inviteMemberToWorkspace,
);
