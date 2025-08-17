import mongoose from 'mongoose';
import { projectServices } from '@/services';
import { EProjectStatus, IBillingPlanType, ProjectModel, WorkspaceModel } from '@/models';
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
  createNewWorkspace: async (ownerId: string, body: CreateNewWorkspaceBody) => {
    const existingWorkspace = await WorkspaceModel.findOne({ ownerId: ownerId, name: body.name });

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
    ownerId: string,
    body: UpdateWorkspaceBody,
  ) => {
    const existingWorkspace = await WorkspaceModel.findOne({
      ownerId,
      name: body.name,
      _id: { $ne: workspaceId },
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
  deleteWorkspace: async (workspaceId: string, ownerId: string) => {
    const workspace = await WorkspaceModel.findOneAndDelete({
      ownerId,
      _id: workspaceId,
    });
    if (!workspace) {
      throw new Error('Workspace not found');
    }
    return workspace;
  },
  getWorkspaceInfoById: async (workspaceId: string) => {
    const workspace = await WorkspaceModel.findById(workspaceId);
    if (!workspace) {
      throw new Error('Workspace not found');
    }
    return workspace;
  },
};
