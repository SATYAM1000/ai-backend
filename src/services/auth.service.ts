import { UserModel } from '@/models';
import { validationSchema } from '@/validations';
import { z } from 'zod';
import { workspaceServices } from '@/services';
import mongoose from 'mongoose';

type UpsertGoogleUserBody = z.infer<typeof validationSchema.auth.upsertGoogleUserSchema>;

export const authService = {
  upsertGoogleUser: async (payload: UpsertGoogleUserBody) => {
    const email = payload.email.trim().toLowerCase();

    const updatedUser = await UserModel.findOneAndUpdate(
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
      },
    );

    if (!updatedUser) {
      return new Error('Failed to create or update user');
    }

    if (updatedUser.isBlocked) {
      return new Error('User is blocked');
    }

    // create default workspace
    const defaultWorkspace = await workspaceServices.createDefaultWorkspace(
      updatedUser._id as mongoose.Types.ObjectId,
    );

    if (!defaultWorkspace) {
      return new Error('Failed to create default workspace');
    }

    updatedUser.defaultWorkspaceId = defaultWorkspace._id as mongoose.Types.ObjectId;
    updatedUser.workspaces = [defaultWorkspace._id as mongoose.Types.ObjectId];

    await updatedUser.save();

    return updatedUser;
  },

  getUserInfoById: async (id: string) => {
    const user = await UserModel.findById(id);
    return user ? user : null;
  },
};
