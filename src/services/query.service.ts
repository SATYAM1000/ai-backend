import { QueryModel } from '@/models';
import { CreateNewQueryBody } from '@/validations';

export const queryServices = {
  createNewQuery: async (payload: CreateNewQueryBody) => {
    const query = await QueryModel.create(payload);
    return query;
  },
};
