import { Request, Response, NextFunction } from 'express';
import { THttpError } from '@/@types';
import { HttpError } from '@/utils/http-error.util';

export const asyncHandler =
  <Req = Request, Res = Response>(
    fn: (req: Req, res: Res, next: NextFunction) => Promise<unknown>,
  ) =>
  async (req: Req, res: Res, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      const request = req as Request;

      const statusCode = error instanceof HttpError ? error.statusCode : 500;

      const httpError: THttpError = {
        success: false,
        statusCode,
        request: {
          ip: request.ip || null,
          method: request.method,
          url: request.originalUrl,
        },
        message: error instanceof Error ? error.message : 'Something went wrong',
        data: null,
        trace: error instanceof Error ? { error: error.stack } : null,
      };
      next(httpError);
    }
  };
