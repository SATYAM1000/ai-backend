import { emailServices, workspaceServices } from '@/services';
import { utils } from '@/utils';
import {
  CreateNewWorkspaceBody,
  InviteMemberToWorkspaceBody,
  UpdateWorkspaceBody,
} from '@/validations';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

export const workspaceControllers = {
  getLastEditProjectFromWorkspace: utils.asyncHandler(async (req: Request, res: Response, next) => {
    const workspaceId = req.params.id as string;
    const userId = req.user?._id;
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
    const ownerId = req.user!._id;
    const result = await workspaceServices.createNewWorkspace(ownerId, body);
    return utils.httpResponse(req, res, 200, 'Workspace created successfully', result);
  }),
  updateExistingWorkspace: utils.asyncHandler(async (req: Request, res: Response, next) => {
    const workspaceId = req.params.id;
    const ownerId = req.user!._id;
    if (!workspaceId || !mongoose.Types.ObjectId.isValid(workspaceId)) {
      return utils.httpError(next, new Error('Invalid workspace ID'), req, 400);
    }

    const { body } = req as { body: UpdateWorkspaceBody };

    const result = await workspaceServices.updateExistingWorkspace(workspaceId, ownerId, body);
    return utils.httpResponse(req, res, 200, 'Workspace updated successfully', result);
  }),
  deleteWorkspace: utils.asyncHandler(async (req: Request, res: Response, next) => {
    const workspaceId = req.params.id;
    const ownerId = req.user!._id;
    if (!workspaceId || !mongoose.Types.ObjectId.isValid(workspaceId)) {
      return utils.httpError(next, new Error('Invalid workspace ID'), req, 400);
    }
    const result = await workspaceServices.deleteWorkspace(workspaceId, ownerId);
    return utils.httpResponse(req, res, 200, 'Workspace deleted successfully', result);
  }),
  getWorkspaceInfoById: utils.asyncHandler(async (req: Request, res: Response, next) => {
    const workspaceId = req.params.id;
    if (!workspaceId || !mongoose.Types.ObjectId.isValid(workspaceId)) {
      return utils.httpError(next, new Error('Invalid workspace ID'), req, 400);
    }
    const userId = req.user!._id;
    const result = await workspaceServices.getWorkspaceInfoById(workspaceId, userId);
    return utils.httpResponse(req, res, 200, 'Workspace fetched successfully', result);
  }),
  getUserWorkspaces: utils.asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const result = await workspaceServices.getUserWorkspaces(userId);
    return utils.httpResponse(req, res, 200, 'Workspaces fetched successfully', result);
  }),
  getWorkspaceMembers: utils.asyncHandler(async (req: Request, res: Response, next) => {
    const workspaceId = req.params.id;
    if (!workspaceId || !mongoose.Types.ObjectId.isValid(workspaceId)) {
      return utils.httpError(next, new Error('Invalid workspace ID'), req, 400);
    }
    const members = await workspaceServices.getWorkspaceMembers(workspaceId);
    return utils.httpResponse(req, res, 200, 'Members fetched successfully', members);
  }),
  getWorkspaceProjects: utils.asyncHandler(async (req: Request, res: Response, next) => {
    const workspaceId = req.params.id;
    if (!workspaceId || !mongoose.Types.ObjectId.isValid(workspaceId)) {
      return utils.httpError(next, new Error('Invalid workspace ID'), req, 400);
    }
    const projects = await workspaceServices.getWorkspaceProjects(workspaceId);
    return utils.httpResponse(req, res, 200, 'Projects fetched successfully', projects);
  }),
  inviteMemberToWorkspace: utils.asyncHandler(async (req: Request, res: Response, next) => {
    const workspaceId = req.params.id;
    if (!workspaceId || !mongoose.Types.ObjectId.isValid(workspaceId)) {
      return utils.httpError(next, new Error('Invalid workspace ID'), req, 400);
    }
    const { email, role } = req.body as InviteMemberToWorkspaceBody;
    const result = await workspaceServices.inviteMemberToWorkspace(workspaceId, email, role, req);

    return utils.httpResponse(req, res, 200, 'Member invited successfully', result);
  }),

  // TODO: update member role:
  updateMemberRole: utils.asyncHandler(async (req: Request, res: Response, next) => {
    return true;
  }),
  //TODO: remove member role
  removeMember: utils.asyncHandler(async (req: Request, res: Response, next) => {
    return true;
  }),
  // TODO: transfer ownership
  transferOwnership: utils.asyncHandler(async (req: Request, res: Response, next) => {
    return true;
  }),

  //TODO: get invites
  getInvites: utils.asyncHandler(async (req: Request, res: Response, next) => {
    return true;
  }),
  //TODO: accept workspace invite
  acceptInvite: utils.asyncHandler(async (req: Request, res: Response, next) => {
    return true;
  }),

  //TODO: reject workspace invite
  rejectInvite: utils.asyncHandler(async (req: Request, res: Response, next) => {
    return true;
  }),
  //TODO: leave workspace
  leaveWorkspace: utils.asyncHandler(async (req: Request, res: Response, next) => {
    return true;
  }),

  //TODO: add api keys
  addApiKeys: utils.asyncHandler(async (req: Request, res: Response, next) => {
    return true;
  }),
  //TODO: remove apikeys
  removeApiKeys: utils.asyncHandler(async (req: Request, res: Response, next) => {
    return true;
  }),
};
