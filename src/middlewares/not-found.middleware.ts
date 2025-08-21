import { Request, Response, NextFunction } from 'express';
import { utils } from '@/utils';

export const routeNotFoundMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    throw new Error('Route not found');
  } catch (err) {
    return utils.httpError(next, err, req, 404);
  }
};
