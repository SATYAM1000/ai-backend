import { authControllers } from '@/controllers';
import { Router } from 'express';

const userRouter = Router();

userRouter.get('/me', authControllers.getUseInfo);

export default userRouter;
