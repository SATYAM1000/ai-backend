import { Document } from 'mongoose';

export enum IWorkspaceMemberRole {
  OWNER = 'owner',
  MEMBER = 'admin',
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
  userId: string;
  role: IWorkspaceMemberRole;
  joinedAt: Date;
}

export interface IWorkspaceSchema extends Document {
  name: string;
  description: string;
  workspaceLogoUrl: string;
  ownerId: string;
  members: IWorkspaceMember[];
  settings: {
    designSystemId: string;
    globalMempryId: string;
    billingPlan: IBillingPlanType;
    apiKeys: AIProviderApiKey[];
  };
  createdAt: Date;
  updatedAt: Date;
}
