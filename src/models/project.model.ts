import mongoose, { Document } from 'mongoose';

export enum EProjectCollaboratorRole {
  OWNER = 'owner',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

export enum EProjectStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

export enum EProjectVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  WORKSPACE = 'workspace',
}

export interface IProjectCollaborators {
  userId: mongoose.Types.ObjectId;
  role: EProjectCollaboratorRole;
  invitedAt: Date;
}

export interface IProjectSchema extends Document {
  workspaceId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  createdBy: mongoose.Types.ObjectId;
  lastEditedBy?: mongoose.Types.ObjectId;
  collaborators: IProjectCollaborators[];
  status: EProjectStatus;
  visibility: EProjectVisibility;
  queryIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
