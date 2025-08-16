import { UserModel } from '@/models';
import { validationSchema } from '@/validations';
import { z } from 'zod';
import { workspaceServices } from '@/services';
import mongoose from 'mongoose';

type UpsertGoogleUserBody = z.infer<typeof validationSchema.auth.upsertGoogleUserSchema>;

export const authService = {
  upsertGoogleUser: async (payload: UpsertGoogleUserBody) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
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

      if (!user) throw new Error('Failed to create or update user');
      if (user.isBlocked) throw new Error('User is blocked');

      const defaultWorkspace = await workspaceServices.createDefaultWorkspace(
        user._id as mongoose.Types.ObjectId,
        session,
      );

      if (!defaultWorkspace) throw new Error('Failed to create default workspace');

      user.defaultWorkspaceId = defaultWorkspace._id as mongoose.Types.ObjectId;
      user.workspaces = [defaultWorkspace._id as mongoose.Types.ObjectId];

      await user.save({ session });

      await session.commitTransaction();
      session.endSession();

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        defaultWorkspaceId: user.defaultWorkspaceId,
      };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  },

  getUserInfoById: async (id: string) => {
    const user = await UserModel.findById(id);
    return user ? user : null;
  },
};
