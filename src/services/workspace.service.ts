import { WorkspaceModel } from '@/models/workspace.model';
import mongoose from 'mongoose';
import { projectServices } from './project.service';
import { EProjectStatus, ProjectModel } from '@/models';

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
};
