import mongoose, { Document } from 'mongoose';
import { email } from 'zod';

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
  lastLoginAt: Date;
  timezone: string;
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
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
    timezone: {
      type: String,
      required: true,
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

export const User = mongoose.model<IUser>('user', userSchema);
