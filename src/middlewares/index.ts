import { requestLoggerMiddleware } from '@/middlewares/request.middleware';

export const middlewares = {
  request: requestLoggerMiddleware,
};
