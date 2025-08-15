import { Request, Response } from 'express';
import { THttpResponse } from '@/@types';
import { utils } from '@/utils';
import { env } from '@/config';

export const httpResponse = (
  req: Request,
  res: Response,
  responseStatusCode: number,
  responseMessage: string,
  data: unknown = null,
): void => {
  const response: THttpResponse = {
    success: true,
    statusCode: responseStatusCode,
    request: {
      ip: req.ip || null,
      method: req.method,
      url: req.url,
    },
    message: responseMessage,
    data: data,
  };

  utils.logger('info', `✅ CONTROLLER RESPONSE: ${JSON.stringify(response)}`);

  if (env.NODE_ENV === 'production') {
    delete response.request.ip;
  }
  res.status(responseStatusCode).json(response);
};
