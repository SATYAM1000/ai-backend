import { IQuery, IQueryStatus, QueryModel } from '@/models';
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
  getQueryById: async (queryId: string) => {
    const query = await QueryModel.findById(queryId);
    return query;
  },
  updateQueryStatus: async (queryId: string, status: IQueryStatus) => {
    const query = await QueryModel.findByIdAndUpdate(queryId, { status }, { new: true });
    return query;
  },
  updateQuery: async (queryId: string, updates: Partial<IQuery>): Promise<IQuery | null> => {
    const updatedQuery = await QueryModel.findByIdAndUpdate(
      queryId,
      { $set: updates },
      { new: true },
    )
      .lean<IQuery>()
      .exec();

    return updatedQuery;
  },
};
