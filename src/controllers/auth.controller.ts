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
  getUseInfo: utils.asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user?._id) {
      return utils.httpError(next, new Error('Unauthorized access'), req, 401);
    }
    const userDetails = await authService.getUserInfoById(user._id);
    return utils.httpResponse(req, res, 200, 'success', userDetails);
  }),
};
