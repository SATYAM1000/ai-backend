import { EProjectStatus, EProjectVisibility, ProjectModel } from '@/models';
import { CreateNewProjectBody } from '@/validations';
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
  getProjectById: async (userId: mongoose.Types.ObjectId, projectId: string) => {
    const project = await ProjectModel.findOne({
      _id: new mongoose.Types.ObjectId(projectId),
      'collaborators.userId': new mongoose.Types.ObjectId(userId),
      status: EProjectStatus.ACTIVE,
    })
      .populate('workspaceId', 'name')
      .populate('collaborators.userId', 'name email')
      .populate('queryIds');

    return project;
  },
  createNewProject: async (payload: CreateNewProjectBody, userId: mongoose.Types.ObjectId) => {
    return await ProjectModel.create({
      ...payload,
      createdBy: new mongoose.Types.ObjectId(userId),
    });
  },
  deleteProjectFromWorkspace: async (projectId: string, userId: mongoose.Types.ObjectId) => {
    const project = await ProjectModel.findOne({
      _id: new mongoose.Types.ObjectId(projectId),
      status: EProjectStatus.ACTIVE,
      $or: [
        { createdBy: new mongoose.Types.ObjectId(userId) },
        {
          collaborators: {
            $elemMatch: {
              userId: new mongoose.Types.ObjectId(userId),
              role: { $in: ['owner', 'admin'] },
            },
          },
        },
      ],
    });

    if (!project) {
      throw new Error('Project not found or access denied');
    }
    return await ProjectModel.findByIdAndUpdate(
      projectId,
      { status: EProjectStatus.ARCHIVED },
      { new: true },
    );
  },
};
