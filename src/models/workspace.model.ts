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
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}
