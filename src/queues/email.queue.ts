import { Queue } from 'bullmq';
import { redisClient } from '@/config';

let emailQueue: Queue | null = null;

export const initEmailQueue = () => {
  if (!emailQueue) {
    emailQueue = new Queue('email-queue', {
      connection: redisClient,
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
