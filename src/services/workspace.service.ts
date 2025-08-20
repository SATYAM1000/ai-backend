import mongoose from 'mongoose';
import { authService, emailServices, invitationServices, projectServices } from '@/services';
import { generateRandomToken, HttpError } from '@/utils';
import {
  EInvitationStatus,
  EProjectStatus,
  EWorkspaceStatus,
  IBillingPlanType,
  IProjectSchema,
  ProjectModel,
  UserModel,
  WorkspaceModel,
} from '@/models';
import { CreateNewWorkspaceBody, UpdateWorkspaceBody } from '@/validations';

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
    invitedBy: mongoose.Types.ObjectId,
  ) => {
    const session = await mongoose.startSession();

    try {
      return await session.withTransaction(async () => {
        const workspace = await WorkspaceModel.findOne({
          _id: new mongoose.Types.ObjectId(workspaceId),
          status: 'active',
        }).session(session);

        if (!workspace) throw new HttpError('Workspace not found', 404);

        const existingUser = await UserModel.findOne({ email }).session(session);

        if (existingUser) {
          const isAlreadyMember = workspace.members.some(
            (m) => m.userId.toString() === (existingUser._id as string),
          );
          if (isAlreadyMember) throw new HttpError('User already a member', 409);
        }

        let existingInvitation = await invitationServices.getInvitationByEmail(email, workspaceId);

        if (
          existingInvitation &&
          existingInvitation.status === EInvitationStatus.PENDING &&
          existingInvitation.expiresAt > new Date()
        ) {
          existingInvitation.token = generateRandomToken();
          existingInvitation.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          await existingInvitation.save({ session });
        } else {
          existingInvitation = await invitationServices.createNewInvitation(
            email,
            workspaceId,
            role,
            invitedBy,
            session,
          );
        }

        if (!existingInvitation) {
          throw new HttpError('Failed to create invitation', 500);
        }

        const inviter = await authService.getUserInfoById(invitedBy.toString());
        if (!inviter) throw new HttpError('Inviter not found', 404);

        try {
          const invitationLink = await emailServices.addEmailToQueue(
            email,
            existingInvitation.token,
            workspace.name,
            inviter.name,
            inviter.email,
            role,
            existingInvitation._id as string,
          );

          return { invitationId: existingInvitation._id, invitationLink: invitationLink };
        } catch {
          throw new HttpError('Failed to queue invitation email', 500);
        }
      });
    } finally {
      await session.endSession();
    }
  },
};
