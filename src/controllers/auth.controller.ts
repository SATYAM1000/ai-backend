import { Request, Response, NextFunction } from 'express';
import { utils } from '@/utils';

export const authControllers = {
  getUseInfo: utils.asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
      h2: 'hfhf',
    });
  }),
};
