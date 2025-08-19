import mongoose from 'mongoose';

export enum BullMQJobsName {
  SEND_WORKSPACE_INVITATION_EMAIL = 'SEND_WORKSPACE_INVITATION_EMAIL',
  SEND_PROJECT_INVITATION_EMAIL = 'SEND_PROJECT_INVITATION_EMAIL',
}

export type THttpResponse = {
  success: boolean;
  statusCode: number;
  request: {
    ip?: string | null;
    method: string;
    url: string;
  };
  message: string;
  data: unknown;
};

export type THttpError = {
  success: boolean;
  statusCode: number;
  request: {
    ip?: string | null;
    method: string;
    url: string;
  };
  message: string;
  data: unknown;
  trace?: object | null;
};

export interface IAuthenticatedRequest {
  _id: mongoose.Types.ObjectId;
  email: string;
  role: string;
  name: string;
}

export enum EWorkspacePermissions {
  TRANSFER_OWNERSHIP = 'transfer_ownership',
  MANAGE_WORKSPACE = 'manage_workspace',
  INVITE_MEMBERS = 'invite_members',
  VIEW_WORKSPACE = 'view_workspace',
  CHANGE_ROLES = 'change_roles',
  DELETE_WORKSPACE = 'delete_workspace',
  MANAGE_API_KEYS = 'manage_api_keys',
  CREATE_PROJECT = 'create_project',
  EDIT_PROJECT = 'edit_project',
  VIEW_PROJECT = 'view_project',
  UPDATE_PROJECT_INFO = 'update_project_info',
  DELETE_PROJECT = 'delete_project',
  SHARE_PROJECT = 'share_project',
  ACCESS_BILLING = 'access_billing',
}

declare global {
  namespace Express {
    interface Request {
      user?: IAuthenticatedRequest;
    }
  }
}
