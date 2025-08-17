import { ProjectsController } from '@/controllers';
import { middlewares } from '@/middlewares';
import { validationSchema } from '@/validations';
import { Router } from 'express';

export const projectsRouter = Router();

projectsRouter.get('/:id', middlewares.authHandler, ProjectsController.getProjectInfo);
projectsRouter.post(
  '/',
  middlewares.validationHandler(validationSchema.project.createNewProjectSchema),
  middlewares.authHandler,
  ProjectsController.createNewProjectInWorkspace,
);

projectsRouter.delete(
  '/:id',
  middlewares.authHandler,
  ProjectsController.deleteProjectFromWorkspace,
);
