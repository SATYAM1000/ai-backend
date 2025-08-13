import { logger } from '@/config';

export const logMessage = (
  logLevel: 'error' | 'warn' | 'info',
  message: string,
  meta?: Record<string, unknown>,
) => {
  switch (logLevel) {
    case 'error':
      logger.error(message, meta);
      break;
    case 'warn':
      logger.warn(message, meta);
      break;
    case 'info':
      logger.info(message, meta);
      break;
    default:
      logger.info(message, meta);
      break;
  }
};
