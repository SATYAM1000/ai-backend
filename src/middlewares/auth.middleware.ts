import { Request, Response, NextFunction } from 'express';
import { decode } from 'next-auth/jwt';
import mongoose from 'mongoose';
import { env } from '@/config';
import { authService } from '@/services';
import { asyncHandler, HttpError } from '@/utils';

interface IJWTSession {
  sub: string;
  email?: string;
  role?: string;
  name?: string;
}

export const authMiddleware = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const unauthorized = (message = 'Unauthorized access') => new HttpError(message, 401);

    const token =
      req.cookies['authjs.session-token'] || req.cookies['__Secure-authjs.session-token'];

    if (!token) return unauthorized();

    const decoded = (await decode({
      token,
      secret: env.NEXTAUTH_SECRET,
      salt: env.NEXTAUTH_SALT,
    })) as IJWTSession | null;

    if (!decoded?.sub || !mongoose.isValidObjectId(decoded.sub)) return unauthorized();

    const user = await authService.getUserInfoById(decoded.sub);
    if (!user) return unauthorized();

    req.user = {
      _id: user._id as mongoose.Types.ObjectId,
      email: user.email,
      role: user.role,
      name: user.name,
    };
    return next();
  },
);
