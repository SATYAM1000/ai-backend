import mongoose from 'mongoose';
import { projectServices } from '@/services';
import {
  EProjectStatus,
  EWorkspaceStatus,
  IBillingPlanType,
  ProjectModel,
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

    // create default project inside same session
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
      throw new Error('No projects found in this workspace');
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
      throw new Error('Workspace with this name already exists');
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
      throw new Error('Workspace with this name already exists');
    }
    const updatedWorkspace = await WorkspaceModel.findByIdAndUpdate(
      workspaceId,
      { ...body },
      { new: true, runValidators: true },
    );
    if (!updatedWorkspace) {
      throw new Error('Workspace not found');
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
      throw new Error('Workspace not found');
    }

    const deletedWorkspace = await WorkspaceModel.updateOne(
      { _id: workspaceId },
      { status: EWorkspaceStatus.ARCHIVED },
    );

    return deletedWorkspace;
  },
  getWorkspaceInfoById: async (workspaceId: string, ownerId: mongoose.Types.ObjectId) => {
    const workspace = await WorkspaceModel.findOne({
      _id: workspaceId,
      ownerId: new mongoose.Types.ObjectId(ownerId),
      status: EWorkspaceStatus.ACTIVE,
    });

    if (!workspace) {
      throw new Error('Workspace not found');
    }
    return workspace;
  },

  getUserWorkspaces: async (userId: mongoose.Types.ObjectId) => {
    const workspaces = await WorkspaceModel.find({
      $or: [{ ownerId: userId }, { 'members.userId': userId }],
      status: EWorkspaceStatus.ACTIVE,
    })
      .populate('ownerId', 'name avatarUrl')
      .select('name description logo ownerId status isDefault createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .lean();
    return workspaces;
  },
};
