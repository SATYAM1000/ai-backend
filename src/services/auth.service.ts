import { User } from '@/models/user.model';
import { validationSchema } from '@/validations';
import { z } from 'zod';

type UpsertGoogleUserBody = z.infer<typeof validationSchema.auth.upsertGoogleUserSchema>;

export const userService = {
  upsertGoogleUser: async (payload: UpsertGoogleUserBody) => {
    const email = payload.email.trim().toLowerCase();

    const updatedUser = await User.findOneAndUpdate(
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

    if (updatedUser.isBlocked) {
      return new Error('User is blocked');
    }

    return updatedUser;
  },

  getUserInfoById: async (id: string) => {
    const user = await User.findById(id);
    return user ? user : null;
  },
};
