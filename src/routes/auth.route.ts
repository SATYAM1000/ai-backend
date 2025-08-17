import { Router } from 'express';
import { authControllers } from '@/controllers';
import { middlewares } from '@/middlewares';
import { validationSchema } from '@/validations';

export const userRouter = Router();

userRouter.post(
  '/google',
  middlewares.validationHandler(validationSchema.auth.upsertGoogleUserSchema),
  authControllers.upsertGoogleUser,
);
userRouter.get('/me/:id', authControllers.getUserInfo);
