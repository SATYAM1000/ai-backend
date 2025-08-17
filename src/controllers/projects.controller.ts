import { projectServices } from '@/services';
import { utils } from '@/utils';
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
};
