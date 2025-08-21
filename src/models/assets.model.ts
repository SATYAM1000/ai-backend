import mongoose, { Document, Schema, model } from 'mongoose';

export enum EAssetsType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  FILE = 'file',
  PDF = 'pdf',
}

export enum AssetStatus {
  PROCESSING = 'processing',
  READY = 'ready',
  FAILED = 'failed',
}

export interface IAsset extends Document {
  workspaceId: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId;

  type: EAssetsType;
  mimeType: string;

  fileName: string;
  size: number;
  extension: string;

  s3Key: string;
  compressedS3Key?: string;
  thumbnailKey?: string;

  metadata: {
    width?: number;
    height?: number;
    duration?: number;
    pageCount?: number;
  };

  status: AssetStatus;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const assetSchema = new Schema<IAsset>(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    type: { type: String, enum: Object.values(EAssetsType), required: true },
    mimeType: { type: String, required: true },

    fileName: { type: String, required: true },
    size: { type: Number, required: true },
    extension: { type: String, required: true },

    s3Key: { type: String, required: true },
    compressedS3Key: { type: String },
    thumbnailKey: { type: String },

    metadata: {
      width: { type: Number },
      height: { type: Number },
      duration: { type: Number },
      pageCount: { type: Number },
    },

    status: { type: String, enum: Object.values(AssetStatus), default: AssetStatus.PROCESSING },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

assetSchema.index({ workspaceId: 1, projectId: 1 });
assetSchema.index({ uploadedBy: 1 });
assetSchema.index({ type: 1, status: 1 });
assetSchema.index({ fileName: 'text' });
assetSchema.index({ isDeleted: 1, status: 1 });

export const AssetModel = model<IAsset>('Asset', assetSchema);
