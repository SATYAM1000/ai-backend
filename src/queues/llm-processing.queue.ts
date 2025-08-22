import { Queue } from 'bullmq';
import { BullMQJobsName } from '@/@types';
import { redisClient } from '@/config';

let llmQueue: Queue | null = null;
export const initLLMQueue = () => {
  if (!llmQueue) {
    llmQueue = new Queue(BullMQJobsName.QUERY_PROCESSING, {
      connection: redisClient,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: true,
      },
    });
  }
  return llmQueue;
};

export const getLLMQueue = () => {
  if (!llmQueue) {
    throw new Error('LLM queue not initialized. Call initLLMQueue() first.');
  }
  return llmQueue;
};
