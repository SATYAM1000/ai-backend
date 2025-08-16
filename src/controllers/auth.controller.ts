import { Request, Response } from 'express';
import { utils } from '@/utils';
import { userService } from '@/services';
import { z } from 'zod';
import { validationSchema } from '@/validations';
type UpsertGoogleUserBody = z.infer<typeof validationSchema.auth.upsertGoogleUserSchema>;

export const authControllers = {
  upsertGoogleUser: utils.asyncHandler(async (req: Request, res: Response) => {
    const { body } = req as { body: UpsertGoogleUserBody };
    const result = await userService.upsertGoogleUser(body);
    return utils.httpResponse(req, res, 200, 'success', result);
  }),
  getUseInfo: utils.asyncHandler(async (req: Request, res: Response) => {
    return res.status(200).json({
      h2: 'hfhf',
    });
  }),
};
