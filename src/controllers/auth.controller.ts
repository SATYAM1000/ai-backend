import { NextFunction, Request, Response } from 'express';
import { utils } from '@/utils';
import { authService } from '@/services';
import { z } from 'zod';
import { validationSchema } from '@/validations';
type UpsertGoogleUserBody = z.infer<typeof validationSchema.auth.upsertGoogleUserSchema>;

export const authControllers = {
  upsertGoogleUser: utils.asyncHandler(async (req: Request, res: Response) => {
    const { body } = req as { body: UpsertGoogleUserBody };
    const result = await authService.upsertGoogleUser(body);
    return utils.httpResponse(req, res, 200, 'success', result);
  }),
  getUserInfo: utils.asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id as string | undefined;

    if (!userId) {
      return utils.httpError(next, new Error('User ID is required'), req, 400);
    }

    const user = await authService.getUserInfoById(userId);

    if (!user) {
      return utils.httpError(next, new Error('User not found'), req, 404);
    }

    return utils.httpResponse(req, res, 200, 'User fetched successfully', user);
  }),
};
