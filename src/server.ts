import app from '@/index';
import {
  connectToLogsDB,
  connectToMainDB,
  disconnectFromDB,
  env,
  initRedisClient,
  redisClient,
} from '@/config';
import { utils } from '@/utils';
import { initEmailQueue } from '@/queues';
import { initEmailWorker, initLLMWorker } from '@/workers';
import { initLLMQueue } from './queues/llm-processing.queue';

(async function startServer() {
  try {
    await Promise.all([connectToMainDB(), connectToLogsDB(), initRedisClient()]);
    initEmailQueue();
    initEmailWorker();
    initLLMQueue();
    initLLMWorker();

    utils.logger('info', '✅ All services connected (DB + Redis) successfully');
    app.listen(env.PORT, () => {
      utils.logger(
        'info',
        env.NODE_ENV === 'development'
          ? `🚀 Server running on http://localhost:${env.PORT}`
          : `🚀 Server is up and running`,
      );
    });

    process.on('SIGINT', async () => {
      utils.logger('info', '👋 Shutting down gracefully...');
      await disconnectFromDB();
      await redisClient.quit();
      process.exit(0);
    });
  } catch (error) {
    utils.logger('error', '❌ Failed to start server', {
      error: error instanceof Error ? error.stack : error,
    });
    process.exit(1);
  }
})();
