import { projectServices, workspaceServices } from '@/services';
import { utils } from '@/utils';
import { CreateNewProjectBody } from '@/validations';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

export const ProjectsController = {
  getProjectInfo: utils.asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const projectId = req.params.id as string;
    const userId = req.user?._id as string;
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return utils.httpError(next, new Error('Invalid project ID'), req, 400);
    }

    const project = await projectServices.getProjectById(userId, projectId);
    if (!project) {
      return utils.httpError(next, new Error('Project not found'), req, 404);
    }
    return utils.httpResponse(req, res, 200, 'Project fetched successfully', project);
  }),
  createNewProjectInWorkspace: utils.asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { body } = req as { body: CreateNewProjectBody };
      const { workspaceId } = body;
      const userId = req.user?._id as string;
      const workspace = await workspaceServices.getWorkspaceInfoById(workspaceId, userId);
      if (!workspace) {
        return utils.httpError(next, new Error('Workspace not found or access denied'), req, 404);
      }

      const project = await projectServices.createNewProject(body, userId);
      if (!project) {
        return utils.httpError(next, new Error('Failed to create project'), req, 400);
      }

      return utils.httpResponse(req, res, 201, 'Project created successfully', project);
    },
  ),
  deleteProjectFromWorkspace: utils.asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const projectId = req.params.id as string;
      const userId = req.user?._id as string;
      if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
        return utils.httpError(next, new Error('Invalid project ID'), req, 400);
      }
      const result = await projectServices.deleteProjectFromWorkspace(projectId, userId);
      return utils.httpResponse(req, res, 200, 'Project deleted successfully', result);
    },
  ),
};
