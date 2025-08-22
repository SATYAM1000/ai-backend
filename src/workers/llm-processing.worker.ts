import { BullMQJobsName } from '@/@types';
import { env, llmClient, redisClient } from '@/config';
import { IQueryStatus } from '@/models';
import { queryServices } from '@/services';
import { HttpError, utils } from '@/utils';
import { Worker } from 'bullmq';

let llmProcessingWorker: Worker | null = null;

export const initLLMWorker = () => {
  try {
    if (!llmProcessingWorker) {
      llmProcessingWorker = new Worker(
        BullMQJobsName.QUERY_PROCESSING,
        async (job) => {
          try {
            if (job.name === BullMQJobsName.QUERY_PROCESSING) {
              const { queryText, queryId } = job.data;

              const query = await queryServices.getQueryById(queryId);
              if (!query) {
                throw new HttpError('Query not found', 404);
              }
              const updateQueryStatus = await queryServices.updateQueryStatus(
                queryId,
                IQueryStatus.PROCESSING,
              );
              if (!updateQueryStatus) {
                throw new HttpError('Failed to update query status', 404);
              }

              const response = await llmClient.googleGenAI.models.generateContentStream({
                model: 'gemini-2.0-flash-001',
                contents: queryText,
                config: {
                  systemInstruction: 'You are a helpful assistant.',
                  temperature: 0.7,
                  maxOutputTokens: 1000,
                },
              });
              for await (const chunk of response) {
                if (chunk.text) {
                  console.log(chunk.text);
                  await redisClient.publish(
                    `query:${queryId}:stream`,
                    JSON.stringify({ type: 'token', text: chunk.text }),
                  );
                }
              }

              await redisClient.publish(
                `query:${queryId}:stream`,
                JSON.stringify({ type: 'done' }),
              );
            }
          } catch (error) {
            utils.logger('error', 'LLM Worker job failed', { error, jobId: job.id });
            throw error;
          }
        },
        {
          connection: {
            host: env.REDIS_HOST,
            port: parseInt(env.REDIS_PORT),
            username: env.REDIS_USERNAME,
            password: env.REDIS_PASSWORD,
          },
        },
      );

      llmProcessingWorker.on('completed', (job) => {
        utils.logger('info', `LLM job ${job.id} completed successfully`);
      });

      llmProcessingWorker.on('failed', (job, err) => {
        utils.logger('error', `LLM job ${job?.id} failed`, { error: err.message });
      });

      llmProcessingWorker.on('error', (err) => {
        utils.logger('error', 'LLM Worker error', { error: err.message });
      });

      utils.logger('info', '✅ LLM Worker initialized successfully');
    }
  } catch (error) {
    utils.logger('error', '❌ Failed to initialize LLM Worker', {
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
};
