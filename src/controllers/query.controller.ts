import { Request, Response } from 'express';
import { HttpError, asyncHandler, HttpResponse } from '@/utils';
import { CreateNewQueryBody } from '@/validations';
import { projectServices, queryServices } from '@/services';
import { getLLMQueue } from '@/queues';
import { BullMQJobsName } from '@/@types';
import mongoose from 'mongoose';
import { redisClient } from '@/config';

export const queryController = {
  createNewQuery: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const { body } = req as { body: CreateNewQueryBody };

    const { projectId } = body;

    const project = await projectServices.getProjectById(userId, projectId);
    if (!project) {
      throw new HttpError('Project not found', 404);
    }

    const query = await queryServices.createNewQuery(body, userId);

    if (!query) {
      throw new HttpError('Failed to create query', 500);
    }

    await getLLMQueue().add(BullMQJobsName.QUERY_PROCESSING, {
      queryText: query.prompt,
      queryId: query._id,
    });

    return HttpResponse(req, res, 200, 'Query created successfully', query);
  }),
  streamQuery: asyncHandler(async (req: Request, res: Response) => {
    const queryId = req.params.id as string;

    if (!queryId || !mongoose.Types.ObjectId.isValid(queryId)) {
      throw new HttpError('Invalid query ID', 400);
    }
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const channel = `query:${queryId}:stream`;
    const subscriber = redisClient.duplicate();
    await subscriber.connect();

    await subscriber.subscribe(channel);

    subscriber.on('message', (channel, message) => {
      if (channel === `query:${queryId}:stream`) {
        res.write(`data: ${message}\n\n`);
      }
    });

    req.on('close', async () => {
      await subscriber.unsubscribe(channel);
      await subscriber.quit();
      res.end();
    });
  }),
};
