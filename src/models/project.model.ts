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

const projectSchema = new mongoose.Schema<IProjectSchema>(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastEditedBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    collaborators: [
      {
        userId: {
          type: mongoose.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        role: {
          type: String,
          enum: Object.values(EProjectCollaboratorRole),
          default: EProjectCollaboratorRole.VIEWER,
        },
        invitedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: Object.values(EProjectStatus),
      default: EProjectStatus.ACTIVE,
    },
    visibility: {
      ttype: String,
      enum: Object.values(EProjectVisibility),
      default: EProjectVisibility.PRIVATE,
    },
    queryIds: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Query',
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ProjectModel = mongoose.model<IProjectSchema>('Project', projectSchema);
