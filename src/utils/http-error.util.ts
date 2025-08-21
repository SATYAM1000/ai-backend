import { THttpError } from '@/@types';
import { NextFunction, Request } from 'express';
import { utils } from '.';
import { env } from '@/config';

export class HttpError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'HttpError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }
  }
}

const errorObject = (
  err: Error | unknown,
  req: Request,
  errorStatusCode: number = 500,
): THttpError => {
  const errorObj: THttpError = {
    success: false,
    statusCode: errorStatusCode,
    request: {
      ip: req.ip || null,
      method: req.method,
      url: req.originalUrl,
    },
    message: err instanceof Error ? err.message || 'Something went wrong' : 'Something went wrong',
    data: null,
    trace: err instanceof Error ? { error: err.stack } : null,
  };

  utils.logger('error', `❌ CONTROLLER_ERROR: ${JSON.stringify(errorObj)}`);

  if (env.NODE_ENV === 'production') {
    delete errorObj.request.ip;
    delete errorObj.trace;
  }

  return errorObj;
};

export const httpError = (
  nextFunc: NextFunction,
  err: Error | unknown,
  req: Request,
  errorStatusCode: number = 500,
): void => {
  const errorObj = errorObject(err, req, errorStatusCode);
  return nextFunc(errorObj);
};
