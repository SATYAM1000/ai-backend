import { requestLoggerMiddleware } from '@/middlewares/request.middleware';
import { globalErrorMiddleware } from '@/middlewares/global-error.middleware';
import { authMiddleware } from '@/middlewares/auth.middleware';

export const middlewares = {
  request: requestLoggerMiddleware,
  auth: authMiddleware,
  error: globalErrorMiddleware,
};
