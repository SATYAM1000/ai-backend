import mongoose, { Document } from 'mongoose';

export enum IArtifactType {
  CODE = 'code',
  DATA = 'data',
}

export interface IArtifact extends Document {
  projectId: mongoose.Types.ObjectId;
  queryId: mongoose.Types.ObjectId;
  type: IArtifactType;
  title: string;
  code?: string;
  data?: string;
  imageUrl?: string;
  version: number;
  defaultPosition: {
    x: number;
    y: number;
  };
  changedPosition?: {
    x: number;
    y: number;
  };
  isDeleted: boolean;
  connectedWithArtifactId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const artifactSchema = new mongoose.Schema<IArtifact>(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    queryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Query',
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(IArtifactType),
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    code: {
      type: String,
    },
    data: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    version: {
      type: Number,
      default: 1,
    },
    defaultPosition: {
      x: {
        type: Number,
        required: true,
      },
      y: {
        type: Number,
        required: true,
      },
    },
    changedPosition: {
      x: {
        type: Number,
      },
      y: {
        type: Number,
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    connectedWithArtifactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artifact',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

artifactSchema.index(
  { projectId: 1, isDeleted: 1, updatedAt: -1 },
  { partialFilterExpression: { isDeleted: false } },
);

artifactSchema.index({ queryId: 1 });
artifactSchema.index({ connectedWithArtifactId: 1 });
artifactSchema.index({ type: 1 });
artifactSchema.index({ title: 'text' });

export const ArtifactModel = mongoose.model<IArtifact>('Artifact', artifactSchema);
