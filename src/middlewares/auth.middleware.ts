import { utils } from '@/utils';
import { Request, Response, NextFunction } from 'express';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization');
    if(!token){
        
    }
  } catch (error) {
    utils.logger('error', 'Auth middleware error', {
      error: error instanceof Error ? error.stack : error,
    });
  }
};
