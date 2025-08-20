import { Queue } from 'bullmq';
import { redisClient } from '@/config';
import { BullMQJobsName } from '@/@types';

let emailQueue: Queue | null = null;

export const initEmailQueue = () => {
  if (!emailQueue) {
    emailQueue = new Queue(BullMQJobsName.SEND_WORKSPACE_INVITATION_EMAIL, {
      connection: redisClient,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: true,
      },
    });
  }
  return emailQueue;
};

export const getEmailQueue = () => {
  if (!emailQueue) {
    throw new Error('Email queue not initialized. Call initEmailQueue() first.');
  }
  return emailQueue;
};
