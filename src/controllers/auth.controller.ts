import { Request, Response } from 'express';
import { HttpError, HttpResponse, utils } from '@/utils';
import { authService } from '@/services';
import { z } from 'zod';
import { validationSchema } from '@/validations';
type UpsertGoogleUserBody = z.infer<typeof validationSchema.auth.upsertGoogleUserSchema>;

export const authControllers = {
  upsertGoogleUser: utils.asyncHandler(async (req: Request, res: Response) => {
    const { body } = req as { body: UpsertGoogleUserBody };
    const result = await authService.upsertGoogleUser(body);
    return HttpResponse(req, res, 200, 'success', result);
  }),
  getUserInfo: utils.asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.id as string | undefined;

    if (!userId) {
      throw new HttpError('User ID is required', 400);
    }

    const user = await authService.getUserInfoById(userId);

    if (!user) {
      throw new HttpError('User not found', 404);
    }

    return HttpResponse(req, res, 200, 'User fetched successfully', user);
  }),
};
