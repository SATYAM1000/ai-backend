import mongoose, { Document } from 'mongoose';

export enum IQueryStatus {
  QUEUED = 'queued',
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface IQuery extends Document {
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // who made the query
  query: string;
  response: string[]; // raw llm response for the query
  status: IQueryStatus;
  artifacts: mongoose.Types.ObjectId[]; // ids of artifacts created by the query
  parentQueryId?: mongoose.Types.ObjectId; // id of the parent query
  attachments: mongoose.Types.ObjectId[];
  artifactReferenceIds: mongoose.Types.ObjectId[];
  isDeleted: boolean;
  summary?: string;
  createdAt: Date;
  updatedAt: Date;
}
