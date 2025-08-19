import { UserModel } from '@/models';
import { validationSchema } from '@/validations';
import { z } from 'zod';
import { workspaceServices } from '@/services';
import mongoose from 'mongoose';
import { asyncHandler, HttpError } from '@/utils';

type UpsertGoogleUserBody = z.infer<typeof validationSchema.auth.upsertGoogleUserSchema>;

type UserResponse = {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  defaultWorkspaceId: mongoose.Types.ObjectId;
};

export const authService = {
  upsertGoogleUser: asyncHandler(async (payload: UpsertGoogleUserBody): Promise<UserResponse> => {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const email = payload.email.trim().toLowerCase();

      let user = await UserModel.findOneAndUpdate(
        { googleId: payload.providerAccountId },
        {
          $setOnInsert: {
            name: payload.name.trim(),
            email,
            role: payload.role,
            isVerified: true,
            googleId: payload.providerAccountId,
          },
          $set: {
            lastLoginAt: new Date(),
            avatarUrl: payload.image || undefined,
          },
        },
        {
          new: true,
          upsert: true,
          session,
        },
      );

      if (!user) {
        throw new HttpError('Failed to create or update user', 500);
      }
      if (user.isBlocked) {
        throw new HttpError('User is blocked', 403);
      }

      if (user.defaultWorkspaceId) {
        await session.commitTransaction();
        return {
          _id: user._id as mongoose.Types.ObjectId,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
          defaultWorkspaceId: user.defaultWorkspaceId,
        };
      }

      const defaultWorkspace = await workspaceServices.createDefaultWorkspace(
        user._id as mongoose.Types.ObjectId,
        session,
      );

      if (!defaultWorkspace) {
        throw new HttpError('Failed to create default workspace', 500);
      }

      user.defaultWorkspaceId = defaultWorkspace._id as mongoose.Types.ObjectId;
      user.workspaces = [defaultWorkspace._id as mongoose.Types.ObjectId];

      await user.save({ session });

      await session.commitTransaction();

      return {
        _id: user._id as mongoose.Types.ObjectId,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        defaultWorkspaceId: user.defaultWorkspaceId,
      };
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }),
  getUserInfoById: asyncHandler(async (id: string) => {
    return UserModel.findById(id).select('-workspaces -googleId -isBlocked -lastLoginAt');
  }),
};
