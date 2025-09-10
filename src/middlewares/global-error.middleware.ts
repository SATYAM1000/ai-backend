import { NextFunction, Request, Response } from 'express';
import { THttpError } from '@/@types';
import { utils } from '@/utils';

export const globalErrorMiddleware = (
  err: THttpError,
  _: Request,
  res: Response,
  __: NextFunction,
) => {
  utils.logger('error', `❌ CONTROLLER_ERROR: ${JSON.stringify(err)}`);
  res.status(err.statusCode).json(err);
};
