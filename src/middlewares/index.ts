import { requestLoggerMiddleware } from '@/middlewares/request.middleware';
import { globalErrorMiddleware } from '@/middlewares/global-error.middleware';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { routeNotFoundMiddleware } from '@/middlewares/not-found.middleware';
import { validateMiddleware } from '@/middlewares/validation.middleware';

export const middlewares = {
  requestHandler: requestLoggerMiddleware,
  authHandler: authMiddleware,
  errorHandler: globalErrorMiddleware,
  notFoundHandler: routeNotFoundMiddleware,
  validationHandler: validateMiddleware,
};
