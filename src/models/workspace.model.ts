import mongoose, { Document } from 'mongoose';

export enum IWorkspaceMemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
  GUEST = 'guest',
}

export enum IBillingPlanType {
  FREE = 'free',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

export interface AIProviderApiKey {
  name: string;
  apiKey: string;
}

export interface IWorkspaceMember {
  userId: mongoose.Types.ObjectId;
  role: IWorkspaceMemberRole;
  joinedAt: Date;
}

export enum EWorkspaceStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

export interface IWorkspaceSchema extends Document {
  name: string;
  description?: string;
  logo?: string;
  ownerId: mongoose.Types.ObjectId;
  projects: mongoose.Types.ObjectId[];
  members: IWorkspaceMember[];
  settings: {
    designSystemId?: mongoose.Types.ObjectId;
    globalMemoryId?: mongoose.Types.ObjectId;
    billingPlan: IBillingPlanType;
    apiKeys: AIProviderApiKey[];
  };
  status: EWorkspaceStatus;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const workspaceSchema = new mongoose.Schema<IWorkspaceSchema>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    projects: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Project',
      },
    ],
    members: [
      {
        userId: {
          type: mongoose.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        role: {
          type: String,
          enum: Object.values(IWorkspaceMemberRole),
          default: IWorkspaceMemberRole.VIEWER,
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    settings: {
      designSystemId: {
        type: mongoose.Types.ObjectId,
        ref: 'DesignSystem',
      },
      globalMemoryId: {
        type: mongoose.Types.ObjectId,
        ref: 'GlobalMemory',
      },
      billingPlan: {
        type: String,
        enum: Object.values(IBillingPlanType),
        default: IBillingPlanType.FREE,
      },
      apiKeys: [
        {
          name: {
            type: String,
            required: true,
          },
          apiKey: {
            type: String,
            required: true,
          },
        },
      ],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(EWorkspaceStatus),
      default: EWorkspaceStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

workspaceSchema.index({ ownerId: 1 });
workspaceSchema.index({ 'members.userId': 1 });
workspaceSchema.index(
  { name: 'text', description: 'text' },
  { weights: { name: 5, description: 1 } },
);

workspaceSchema.index(
  { ownerId: 1, name: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'active' },
  },
);

export const WorkspaceModel = mongoose.model<IWorkspaceSchema>('Workspace', workspaceSchema);
