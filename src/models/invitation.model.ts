import mongoose, { Document } from 'mongoose';
import { IWorkspaceMemberRole } from './workspace.model';

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
  role: IWorkspaceMemberRole;
  status: EInvitationStatus;
  token: string;
  resentCount: number;
  lastSentAt?: Date;
  expiresAt: Date;
  acceptedAt?: Date;
  cancelledAt?: Date;
  respondedAt?: Date;
  responseIp?: string;
  createdAt: Date;
  updatedAt: Date;
}

const invitationSchema = new mongoose.Schema<IInvitation>(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    role: {
      type: String,
      enum: Object.values(IWorkspaceMemberRole),
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(EInvitationStatus),
      default: EInvitationStatus.PENDING,
    },

    token: { type: String, required: true, unique: true, select: false }, // hashed in practice
    resentCount: { type: Number, default: 0 },
    lastSentAt: { type: Date },

    expiresAt: { type: Date, required: true },

    acceptedAt: { type: Date },
    cancelledAt: { type: Date },
    respondedAt: { type: Date },
    responseIp: { type: String },
  },
  { timestamps: true, versionKey: false },
);

// Indexes
invitationSchema.index(
  { email: 1, workspaceId: 1, projectId: 1 },
  { unique: true, partialFilterExpression: { status: EInvitationStatus.PENDING } },
);

invitationSchema.index({ token: 1 }, { unique: true });
invitationSchema.index({ expiresAt: 1 });

export const InvitationModel = mongoose.model<IInvitation>('Invitation', invitationSchema);
