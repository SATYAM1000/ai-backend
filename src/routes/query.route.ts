import { queryController } from '@/controllers';
import { middlewares } from '@/middlewares';
import { queryValidationSchemas } from '@/validations/query.validation';
import { Router } from 'express';

export const queryRouter = Router();

queryRouter.post(
  '/',
  middlewares.authHandler,
  middlewares.validationHandler(queryValidationSchemas.createNewQuerySchema),
  queryController.createNewQuery,
);

queryRouter.get('/:id/stream', middlewares.authHandler, queryController.streamQuery);
