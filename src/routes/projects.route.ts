import { ProjectsController } from '@/controllers';
import { middlewares } from '@/middlewares';
import { Router } from 'express';

export const projectsRouter = Router();

projectsRouter.get('/:id', middlewares.authHandler, ProjectsController.getProjectInfo);
