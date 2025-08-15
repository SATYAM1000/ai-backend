import { User } from '@/models/user.model';

export const userService = {
  getUserInfoById: async (id: string) => {
    return User.findById(id);
  },
};
