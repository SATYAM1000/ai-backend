import { Request, Response, NextFunction } from 'express';
import { utils } from '@/utils';
import { responseMessage } from '@/constants';

export const routeNotFoundMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    throw new Error(responseMessage.NOT_FOUND('route'));
  } catch (err) {
    return utils.httpError(next, err, req, 404);
  }
};
