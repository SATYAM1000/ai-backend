import { Router } from 'express';
import { authControllers } from '@/controllers';
import { middlewares } from '@/middlewares';
import { validationSchema } from '@/validations';

const userRouter = Router();

userRouter.post(
  '/google',
  middlewares.validationHandler(validationSchema.auth.upsertGoogleUserSchema),
  authControllers.upsertGoogleUser,
);
userRouter.get('/me', middlewares.authHandler, authControllers.getUseInfo
  
);

export default userRouter;
