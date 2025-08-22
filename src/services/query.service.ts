import { QueryModel } from '@/models';
import { CreateNewQueryBody } from '@/validations';
import mongoose from 'mongoose';

export const queryServices = {
  createNewQuery: async (payload: CreateNewQueryBody, userId: mongoose.Types.ObjectId) => {
    const query = await QueryModel.create({
      ...payload,
      userId,
    });
    return query;
  },
};
