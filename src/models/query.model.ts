import mongoose, { Document, Schema } from 'mongoose';

export enum IQueryStatus {
  QUEUED = 'queued',
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface IQuery extends Document {
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; 
  query: string;
  response: string[];
  status: IQueryStatus;
  artifacts: mongoose.Types.ObjectId[]; 
  parentQueryId?: mongoose.Types.ObjectId;
  attachments: mongoose.Types.ObjectId[];
  artifactReferenceIds: mongoose.Types.ObjectId[];
  isDeleted: boolean;
  summary?: string;
  createdAt: Date;
  updatedAt: Date;
}

const querySchema = new mongoose.Schema<IQuery>(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    query: {
      type: String,
      required: true,
    },
    response: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: Object.values(IQueryStatus),
      default: IQueryStatus.QUEUED,
    },
    artifacts: [{ type: Schema.Types.ObjectId, ref: 'Artifact' }],
    parentQueryId: { type: Schema.Types.ObjectId, ref: 'Query' },
    attachments: [{ type: Schema.Types.ObjectId, ref: 'Attachment' }],
    artifactReferenceIds: [{ type: Schema.Types.ObjectId, ref: 'Artifact' }],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    summary: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

querySchema.index({ projectId: 1, createdAt: -1 });
querySchema.index({ status: 1, createdAt: 1 });
querySchema.index({ userId: 1, projectId: 1, createdAt: -1 });
querySchema.index({ parentQueryId: 1 });
querySchema.index(
  { projectId: 1, isDeleted: 1, createdAt: -1 },
  { partialFilterExpression: { isDeleted: false } },
);
querySchema.index({ query: 'text', response: 'text' }, { weights: { query: 3, response: 1 } });

export const QueryModel = mongoose.model<IQuery>('Query', querySchema);
