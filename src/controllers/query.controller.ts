import { utils } from '@/utils';

export const queryController = {
  createNewQuery: utils.asyncHandler(async (req: Request, res: Response) => {
    // const { body } = req as { body: CreateNewQueryBody };
    // const result = await queryServices.createNewQuery(body);
  }),
};
