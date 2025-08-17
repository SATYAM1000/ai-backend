import { workspaceServices } from '@/services';
import { utils } from '@/utils';
import { CreateNewWorkspaceBody } from '@/validations';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

export const workspaceControllers = {
  getLastEditProjectFromWorkspace: utils.asyncHandler(async (req: Request, res: Response, next) => {
    const workspaceId = req.params.id as string;
    const userId = req.user?._id as string;
    if (!workspaceId) {
      return utils.httpError(next, new Error('Workspace ID is required'), req, 400);
    }
    const project = await workspaceServices.getLastEditedProjectFromWorkspace(
      new mongoose.Types.ObjectId(workspaceId),
      new mongoose.Types.ObjectId(userId),
    );
    if (!project) {
      return utils.httpError(next, new Error('No projects found in this workspace'), req, 404);
    }
    return utils.httpResponse(req, res, 200, 'Project fetched successfully', project);
  }),
  createNewWorkspace: utils.asyncHandler(async (req: Request, res: Response) => {
    const { body } = req as { body: CreateNewWorkspaceBody };
    const ownerId = req.user?._id as string;
    const result = await workspaceServices.createNewWorkspace(ownerId, body);
    return utils.httpResponse(req, res, 200, 'Workspace created successfully', result);
  }),
};
