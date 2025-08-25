import { requestLoggerMiddleware } from '@/middlewares/request.middleware';
import { globalErrorMiddleware } from '@/middlewares/global-error.middleware';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { routeNotFoundMiddleware } from '@/middlewares/not-found.middleware';
import { validateMiddleware } from '@/middlewares/validation.middleware';
import { workspacePermissionHandler } from '@/middlewares/workspace.middleware';

export const middlewares = {
  requestHandler: requestLoggerMiddleware,
  authHandler: authMiddleware,
  errorHandler: globalErrorMiddleware,
  notFoundHandler: routeNotFoundMiddleware,
  validationHandler: validateMiddleware,
  workspacePermissionHandler: workspacePermissionHandler,
};

export {
  requestLoggerMiddleware,
  globalErrorMiddleware,
  authMiddleware,
  routeNotFoundMiddleware,
  validateMiddleware,
  workspacePermissionHandler,
};
