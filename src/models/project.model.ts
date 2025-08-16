import { Document } from 'mongoose';

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
  userId: string;
  role: EProjectCollaboratorRole;
  invitedAt: Date;
}

export interface IProjectSchema extends Document {
  workspaceId: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  createdBy: string;
  lastEditedBy: string;
  collaborators: string;
  status: EProjectStatus;
  visiblity: EProjectVisibility;
  createdAt: Date;
  updatedAt: Date;
}
