import { logMessage } from '@/utils/logger.util';
import { asyncHandler } from '@/utils/async-handler.util';
import { httpResponse } from '@/utils/http-response.util';
import { httpError } from '@/utils/http-error.util';
import { permissionsUtil } from '@/utils/permissions.util';

export const utils = {
  logger: logMessage,
  asyncHandler: asyncHandler,
  httpResponse: httpResponse,
  httpError: httpError,
  permissions: {
    permissionsUtil,
  },
};
