import { logMessage } from '@/utils/logger.util';
import { asyncHandler } from '@/utils/async-handler.util';
import { httpResponse as HttpResponse } from '@/utils/http-response.util';
import { httpError, HttpError } from '@/utils/http-error.util';
import { generateRandomToken } from '@/utils/random-token.util';

export const utils = {
  logger: logMessage,
  asyncHandler: asyncHandler,
  httpResponse: HttpResponse,
  httpError: httpError,
  HttpError: HttpError,
  randomToken: generateRandomToken,
};

export { HttpError, HttpResponse, asyncHandler, httpError, logMessage, generateRandomToken };
