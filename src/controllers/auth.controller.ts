import { userService } from '@/services';
import { utils } from '@/utils';
import { NextFunction } from 'express';

export const authControllers = {
  getUseInfo: utils.asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.getUserInfoById(req.user.id);
    if(!user){
      
    }
  }),
};
