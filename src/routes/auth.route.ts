import { Router } from 'express';
import { authControllers } from '@/controllers';
import { middlewares } from '@/middlewares';

const userRouter = Router();

userRouter.get('/me', middlewares.authHandler, authControllers.getUseInfo);

export default userRouter;
