import { Request, Response } from 'express';
import { HttpError, asyncHandler, HttpResponse } from '@/utils';
import { CreateNewQueryBody } from '@/validations';
import { projectServices, queryServices } from '@/services';

export const queryController = {
  createNewQuery: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const { body } = req as { body: CreateNewQueryBody };

    const { projectId } = body;

    const project = await projectServices.getProjectById(userId, projectId);
    if (!project) {
      throw new HttpError('Project not found', 404);
    }

    const query = await queryServices.createNewQuery(body);

    return HttpResponse(req, res, 200, 'Query created successfully', query);
  }),
};
