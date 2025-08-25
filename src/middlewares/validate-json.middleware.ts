import { HttpError, utils } from '@/utils';
import { Request, Response, NextFunction } from 'express';

export const validateJsonMiddleware = (
  err: unknown,
  _req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  if (err instanceof SyntaxError && 'body' in (err as any)) {
    return utils.httpError(next, new Error('Invalid JSON format'), _req, 400);
  }
  return next(err);
};
