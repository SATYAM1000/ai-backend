import { Request, Response, NextFunction } from 'express';
import { THttpError } from '@/@types';
import { responseMessage } from '@/constants';

export const asyncHandler =
  <Req = Request, Res = Response>(
    fn: (req: Req, res: Res, next: NextFunction) => Promise<unknown>,
  ) =>
  async (req: Req, res: Res, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      const request = req as Request;
      const httpError: THttpError = {
        success: false,
        statusCode: 500,
        request: {
          ip: request.ip || null,
          method: request.method,
          url: request.originalUrl,
        },
        message: error instanceof Error ? error.message : responseMessage.SOMETHING_WENT_WRONG,
        data: null,
        trace: error instanceof Error ? { error: error.stack } : null,
      };
      next(httpError);
    }
  };
