import { WorkspaceModel } from '@/models/workspace.model';
import mongoose from 'mongoose';
import { projectServices } from './project.service';

export const workspaceServices = {
  createDefaultWorkspace: async (id: mongoose.Types.ObjectId) => {
    const workspace = new WorkspaceModel({
      name: 'My Workspace',
      ownerId: id,
      projects: [],
      members: [],
      settings: {
        billingPlan: 'free',
        apiKeys: [],
      },
      isDefault: true,
    });

    // create default project also
    const defaultProject = await projectServices.createDefaultProject(
      workspace._id as mongoose.Types.ObjectId,
      id as mongoose.Types.ObjectId,
    );
    workspace.projects.push(defaultProject._id as mongoose.Types.ObjectId);

    return await workspace.save();
  },
};
