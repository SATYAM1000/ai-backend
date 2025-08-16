import { Request, Response, NextFunction } from 'express';
import { decode } from 'next-auth/jwt';
import mongoose from 'mongoose';
import { env } from '@/config';
import { authService } from '@/services';
import { utils } from '@/utils';
import { httpError } from '@/utils/http-error.util';

interface IJWTSession {
  sub: string;
  email?: string;
}

export const authMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  const unauthorized = (message = 'Unauthorized access') =>
    httpError(next, new Error(message), req, 401);

  try {
    const token =
      req.cookies['authjs.session-token'] || req.cookies['__Secure-authjs.session-token'];
    console.log('token', token);

    if (!token) return unauthorized();

    const decoded = (await decode({
      token,
      secret: env.NEXTAUTH_SECRET,
      salt: env.NEXTAUTH_SALT,
    })) as IJWTSession | null;

    if (!decoded?.sub || !mongoose.isValidObjectId(decoded.sub)) return unauthorized();

    const user = await authService.getUserInfoById(decoded.sub);
    if (!user) return unauthorized();

    req.user = { _id: String(user._id), email: user.email };
    return next();
  } catch (error) {
    return utils.httpError(next, error, req);
  }
};
