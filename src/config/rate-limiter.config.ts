import rateLimit from 'express-rate-limit';
import { utils } from '@/utils';

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, _res, next) => {
    return utils.httpError(next, new Error('Too many requests'), req, 429);
  },
});
