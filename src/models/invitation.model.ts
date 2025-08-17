import mongoose, { Document } from 'mongoose';

export enum EInvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export interface IInvitation extends Document {
  email: string;
  workspaceId: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  invitedBy: mongoose.Types.ObjectId;
  role: string;
  status: EInvitationStatus;
  acceptedAt?: Date;
  cancelledAt?: Date;
  token: string;
  resentCount: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const invitationSchema = new mongoose.Schema<IInvitation>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(EInvitationStatus),
      default: EInvitationStatus.PENDING,
    },
    acceptedAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    token: {
      type: String,
      required: true,
    },
    resentCount: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

invitationSchema.index({ email: 1, workspaceId: 1, projectId: 1, status: 1 });
invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
invitationSchema.index(
  { email: 1, workspaceId: 1, projectId: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: EInvitationStatus.PENDING } },
);

export const InvitationModel = mongoose.model<IInvitation>('Invitation', invitationSchema);
