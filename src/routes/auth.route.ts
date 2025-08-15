import { userController } from '@/controllers';
import { Router } from 'express';

const userRouter = Router();

userRouter.get('/me', userController.getUseInfo);

export default userRouter;
