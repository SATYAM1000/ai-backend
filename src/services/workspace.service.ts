import { Request } from 'express';
import mongoose from 'mongoose';
import { emailServices, invitationServices, projectServices } from '@/services';
import { HttpError } from '@/utils';
import {
  EProjectStatus,
  EWorkspaceStatus,
  IBillingPlanType,
  IProjectSchema,
  ProjectModel,
  UserModel,
  WorkspaceModel,
} from '@/models';
import { CreateNewWorkspaceBody, UpdateWorkspaceBody } from '@/validations';
import { getEmailQueue } from '@/queues/email.queue';

export const workspaceServices = {
  createDefaultWorkspace: async (
    userId: mongoose.Types.ObjectId,
    session?: mongoose.ClientSession,
  ) => {
    const workspace = new WorkspaceModel({
      name: 'My Workspace',
      ownerId: userId,
      projects: [],
      members: [],
      settings: {
        billingPlan: 'free',
        apiKeys: [],
      },
      isDefault: true,
    });

    const defaultProject = await projectServices.createDefaultProject(
      workspace._id as mongoose.Types.ObjectId,
      userId,
      session,
    );

    workspace.projects.push(defaultProject[0]!._id as mongoose.Types.ObjectId);

    return await workspace.save({ session });
  },
  getLastEditedProjectFromWorkspace: async (
    workspaceId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
  ) => {
    const project = await ProjectModel.findOne({
      workspaceId,
      status: EProjectStatus.ACTIVE,
      createdBy: userId,
    })
      .sort({ updatedAt: -1, createdAt: -1 })
      .select('name description thumbnailUrl')
      .exec();

    if (!project) {
      throw new HttpError('No projects found in this workspace', 404);
    }

    return project;
  },
  createNewWorkspace: async (ownerId: mongoose.Types.ObjectId, body: CreateNewWorkspaceBody) => {
    const existingWorkspace = await WorkspaceModel.findOne({
      ownerId: ownerId,
      name: body.name,
      status: EWorkspaceStatus.ACTIVE,
    });

    if (existingWorkspace) {
      throw new HttpError('Workspace with this name already exists', 409);
    }
    const payload = {
      ...body,
      ownerId,
      projects: [],
      members: [],
      settings: {
        billingPlan: IBillingPlanType.FREE,
        apiKeys: [],
      },
      isDefault: false,
    };
    const workspace = new WorkspaceModel(payload);

    return await workspace.save();
  },
  updateExistingWorkspace: async (
    workspaceId: string,
    ownerId: mongoose.Types.ObjectId,
    body: UpdateWorkspaceBody,
  ) => {
    const existingWorkspace = await WorkspaceModel.findOne({
      ownerId,
      name: body.name,
      _id: { $ne: workspaceId },
      status: EWorkspaceStatus.ACTIVE,
    });

    if (existingWorkspace) {
      throw new HttpError('Workspace with this name already exists', 409);
    }
    const updatedWorkspace = await WorkspaceModel.findByIdAndUpdate(
      workspaceId,
      { ...body },
      { new: true, runValidators: true },
    );
    if (!updatedWorkspace) {
      throw new HttpError('Workspace not found', 404);
    }
    return updatedWorkspace;
  },
  deleteWorkspace: async (workspaceId: string, ownerId: mongoose.Types.ObjectId) => {
    const workspace = await WorkspaceModel.findOne({
      ownerId,
      _id: workspaceId,
      status: EWorkspaceStatus.ACTIVE,
    });
    if (!workspace) {
      throw new HttpError('Workspace not found', 404);
    }

    const deletedWorkspace = await WorkspaceModel.updateOne(
      { _id: workspaceId },
      { status: EWorkspaceStatus.ARCHIVED },
    );

    return deletedWorkspace;
  },
  getWorkspaceInfoById: async (workspaceId: string, userId: mongoose.Types.ObjectId) => {
    const workspace = await WorkspaceModel.findOne({
      _id: new mongoose.Types.ObjectId(workspaceId),
      $or: [{ ownerId: userId }, { 'members.userId': userId }],
      status: EWorkspaceStatus.ACTIVE,
    });

    if (!workspace) {
      throw new HttpError('Workspace not found or access denied', 404);
    }

    return workspace;
  },

  getUserWorkspaces: async (userId: mongoose.Types.ObjectId) => {
    const workspaces = await WorkspaceModel.find({
      $or: [{ ownerId: userId }, { 'members.userId': userId }],
      status: EWorkspaceStatus.ACTIVE,
    })
      .populate('ownerId', 'name avatarUrl')
      .populate('members.userId', 'name avatarUrl')
      .select('name description logo ownerId status isDefault createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .lean();

    if (!workspaces) {
      throw new HttpError('No workspaces found', 404);
    }
    return workspaces;
  },
  getWorkspaceMembers: async (workspaceId: string) => {
    const workspace = await WorkspaceModel.findOne({
      _id: workspaceId,
      status: EWorkspaceStatus.ACTIVE,
    })
      .populate('members.userId', 'name avatarUrl')
      .select('members')
      .lean();
    if (!workspace) {
      throw new HttpError('Workspace not found', 404);
    }

    return workspace;
  },
  getWorkspaceProjects: async (workspaceId: string) => {
    const workspace = await WorkspaceModel.findOne({
      _id: workspaceId,
      status: EWorkspaceStatus.ACTIVE,
    })
      .populate({
        path: 'projects',
        match: { status: { $ne: EProjectStatus.ARCHIVED } },
        select: 'name description thumbnailUrl status visibility updatedAt',
        options: { sort: { updatedAt: -1 } },
      })
      .select('projects')
      .lean<{ projects: IProjectSchema[] }>();

    if (!workspace) {
      throw new HttpError('Workspace not found', 404);
    }
    return workspace;
  },
  inviteMemberToWorkspace: async (
    workspaceId: string,
    email: string,
    role: string,
    req: Request,
  ) => {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new HttpError('User not found', 404);
    }

    const workspace = await WorkspaceModel.findOne({
      _id: new mongoose.Types.ObjectId(workspaceId),
      status: 'active',
      members: { $not: { $elemMatch: { userId: user._id } } },
    });

    if (!workspace) {
      throw new HttpError('Workspace not found or user already a member', 409);
    }

    const existingInvitation = await invitationServices.getInvitationByEmail(email, workspaceId);

    if (existingInvitation) {
      throw new HttpError('Invitation already sent', 409);
    }

    const invitation = await invitationServices.createNewInvitation(
      email,
      workspaceId,
      role,
      req.user!._id,
    );

    const inviteLink = `https://yourapp.com/invites/accept/${invitation.token}`;

    const templeteVariables = {
      workspaceName: workspace.name,
      inviterName: req.user!.name,
      inviterEmail: req.user!.email,
      role,
      inviteLink,
      expiresIn: '7 days',
      appName: 'ProtoAI',
      nowDate: new Date().toLocaleDateString(),
      companyAddress: '123 Startup Street, SF',
      supportUrl: 'https://yourapp.com/support',
      mirrorLink: 'https://yourapp.com/invites/view?id=123',
    };

    await getEmailQueue().add(
      'send-workspace-invite',
      {
        to: email,
        workspaceName: workspace.name,
        templateVariables: templeteVariables,
      },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 60000 },
        removeOnComplete: true,
      },
    );

    const result = await emailServices.sendWorkspaceInvitationEmail(
      email,
      workspace.name,
      templeteVariables,
    );

    return result;
  },
};
