import { utils } from '@/utils';
import { Request, Response, NextFunction } from 'express';

export const requestLoggerMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  utils.logger('info', `Incoming request: ${req.method} ${req.url}`, {
    headers: req.headers,
    query: req.query,
    params: req.params,
    body: req.body,
  });
  next();
};
