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
