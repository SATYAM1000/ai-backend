import mongoose, { Document, Schema } from 'mongoose';

enum ERole {
  user = 'user',
  admin = 'admin',
}

export interface IUser extends Document {
  googleId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isBlocked: boolean;
  role: ERole;
  isVerified: boolean;
  defaultWorkspaceId: mongoose.Types.ObjectId;
  workspaces: mongoose.Types.ObjectId[];
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatarUrl: {
      type: String,
      trim: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ERole,
      default: ERole.user,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    defaultWorkspaceId: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
    },
    workspaces: [{ type: Schema.Types.ObjectId, ref: 'Workspace' }],
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'users',
  },
);

userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ email: 1, googleId: 1 });
userSchema.index({ workspaces: 1 });

export const UserModel = mongoose.model<IUser>('user', userSchema);
