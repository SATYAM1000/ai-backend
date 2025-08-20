import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { workspaceServices } from '@/services';
import { HttpError, HttpResponse, asyncHandler } from '@/utils';
import {
  CreateNewWorkspaceBody,
  InviteMemberToWorkspaceBody,
  UpdateWorkspaceBody,
} from '@/validations';

export const workspaceControllers = {
  getLastEditProjectFromWorkspace: asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = req.params.id as string;
    const userId = req.user?._id;
    if (!workspaceId) {
      throw new HttpError('Workspace ID is required', 400);
    }
    const project = await workspaceServices.getLastEditedProjectFromWorkspace(
      new mongoose.Types.ObjectId(workspaceId),
      new mongoose.Types.ObjectId(userId),
    );
    return HttpResponse(req, res, 200, 'Project fetched successfully', project);
  }),
  createNewWorkspace: asyncHandler(async (req: Request, res: Response) => {
    const { body } = req as { body: CreateNewWorkspaceBody };
    const ownerId = req.user!._id;
    const result = await workspaceServices.createNewWorkspace(ownerId, body);
    return HttpResponse(req, res, 200, 'Workspace created successfully', result);
  }),
  updateExistingWorkspace: asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = req.params.id;
    const ownerId = req.user!._id;
    if (!workspaceId || !mongoose.Types.ObjectId.isValid(workspaceId)) {
      throw new HttpError('Invalid workspace ID', 400);
    }
    const { body } = req as { body: UpdateWorkspaceBody };
    const result = await workspaceServices.updateExistingWorkspace(workspaceId, ownerId, body);
    return HttpResponse(req, res, 200, 'Workspace updated successfully', result);
  }),
  deleteWorkspace: asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = req.params.id;
    const ownerId = req.user!._id;
    if (!workspaceId || !mongoose.Types.ObjectId.isValid(workspaceId)) {
      throw new HttpError('Invalid workspace ID', 400);
    }
    const result = await workspaceServices.deleteWorkspace(workspaceId, ownerId);
    return HttpResponse(req, res, 200, 'Workspace deleted successfully', result);
  }),
  getWorkspaceInfoById: asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = req.params.id;
    if (!workspaceId || !mongoose.Types.ObjectId.isValid(workspaceId)) {
      throw new HttpError('Invalid workspace ID', 400);
    }
    const userId = req.user!._id;
    const result = await workspaceServices.getWorkspaceInfoById(workspaceId, userId);
    return HttpResponse(req, res, 200, 'Workspace fetched successfully', result);
  }),
  getUserWorkspaces: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const result = await workspaceServices.getUserWorkspaces(userId);
    return HttpResponse(req, res, 200, 'Workspaces fetched successfully', result);
  }),
  getWorkspaceMembers: asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = req.params.id;
    if (!workspaceId || !mongoose.Types.ObjectId.isValid(workspaceId)) {
      throw new HttpError('Invalid workspace ID', 400);
    }
    const members = await workspaceServices.getWorkspaceMembers(workspaceId);
    return HttpResponse(req, res, 200, 'Members fetched successfully', members);
  }),
  getWorkspaceProjects: asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = req.params.id;
    if (!workspaceId || !mongoose.Types.ObjectId.isValid(workspaceId)) {
      throw new HttpError('Invalid workspace ID', 400);
    }
    const projects = await workspaceServices.getWorkspaceProjects(workspaceId);
    return HttpResponse(req, res, 200, 'Projects fetched successfully', projects);
  }),
  inviteMemberToWorkspace: asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = req.params.id;
    if (!workspaceId || !mongoose.Types.ObjectId.isValid(workspaceId)) {
      throw new HttpError('Invalid workspace ID', 400);
    }
    const { email, role } = req.body as InviteMemberToWorkspaceBody;
    const result = await workspaceServices.inviteMemberToWorkspace(
      workspaceId,
      email,
      role,
      req.user!._id,
    );
    return HttpResponse(req, res, 200, 'Invitation sent successfully', result);
  }),
};
