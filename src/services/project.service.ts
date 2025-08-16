import { EProjectStatus, EProjectVisibility, ProjectModel } from '@/models';
import mongoose from 'mongoose';

export const projectServices = {
  createDefaultProject: async (
    workspaceId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
    session?: mongoose.ClientSession,
  ) => {
    const defaultProjectPayload = {
      workspaceId: workspaceId,
      name: 'My Project',
      createdBy: userId,
      collaborators: [
        {
          userId: userId,
          role: 'owner',
          invitedAt: new Date(),
        },
      ],
      status: EProjectStatus.ACTIVE,
      visibility: EProjectVisibility.PRIVATE,
      queryIds: [],
    };

    return await ProjectModel.create([defaultProjectPayload], { session });
  },
};
