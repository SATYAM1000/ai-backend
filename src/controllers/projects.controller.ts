import { projectServices, workspaceServices } from '@/services';
import { asyncHandler, HttpError, HttpResponse } from '@/utils';
import { CreateNewProjectBody } from '@/validations';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

export const ProjectsController = {
  getProjectInfo: asyncHandler(async (req: Request, res: Response) => {
    const projectId = req.params.id as string;
    const userId = req.user!._id;
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      throw new HttpError('Invalid project ID', 400);
    }

    const project = await projectServices.getProjectById(userId, projectId);
    if (!project) {
      throw new HttpError('Project not found', 404);
    }
    return HttpResponse(req, res, 200, 'Project fetched successfully', project);
  }),
  createNewProjectInWorkspace: asyncHandler(async (req: Request, res: Response) => {
    const { body } = req as { body: CreateNewProjectBody };
    const { workspaceId } = body;
    const userId = req.user!._id;
    const workspace = await workspaceServices.getWorkspaceInfoById(workspaceId, userId);
    if (!workspace) {
      throw new HttpError('Workspace not found', 404);
    }

    const project = await projectServices.createNewProject(body, userId);
    if (!project) {
      throw new HttpError('Failed to create project', 500);
    }

    return HttpResponse(req, res, 201, 'Project created successfully', project);
  }),
  deleteProjectFromWorkspace: asyncHandler(async (req: Request, res: Response) => {
    const projectId = req.params.id as string;
    const userId = req.user!._id;
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      throw new HttpError('Invalid project ID', 400);
    }
    const result = await projectServices.deleteProjectFromWorkspace(projectId, userId);
    return HttpResponse(req, res, 200, 'Project deleted successfully', result);
  }),

};
