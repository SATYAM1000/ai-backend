import { logMessage } from '@/utils/logger.util';
import { asyncHandler } from '@/utils/async-handler.util';
import { httpResponse } from '@/utils/http-response.util';
import { httpError, HttpError } from '@/utils/http-error.util';
import { permissionsUtil } from '@/utils/permissions.util';
import { redisUtils } from '@/utils/redis.util';

export const utils = {
  logger: logMessage,
  asyncHandler: asyncHandler,
  httpResponse: httpResponse,
  httpError: httpError,
  HttpError: HttpError,
  redis: redisUtils,
  permissions: {
    permissionsUtil,
  },
};

// Also export HttpError directly for easier imports
export { HttpError };
