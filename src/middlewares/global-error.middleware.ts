import { NextFunction, Request, Response } from 'express';
import { THttpError } from '@/@types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const globalErrorMiddleware = (
  err: THttpError,
  _: Request,
  res: Response,
  __: NextFunction,
) => {
  res.status(err.statusCode).json(err);
};
