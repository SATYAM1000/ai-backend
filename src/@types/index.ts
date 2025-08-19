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

declare global {
  namespace Express {
    interface Request {
      user?: IAuthenticatedRequest;
    }
  }
}
