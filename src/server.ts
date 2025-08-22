import http from 'http';
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
import { initEmailQueue, initLLMQueue } from '@/queues';
import { initEmailWorker, initLLMWorker } from '@/workers';
import { initSocketIO } from '@/socket';

(async function startServer() {
  try {
    await Promise.all([connectToMainDB(), connectToLogsDB(), initRedisClient()]);
    initEmailQueue();
    initEmailWorker();
    initLLMQueue();
    initLLMWorker();

    const rawHttpServer = http.createServer(app);
    initSocketIO(rawHttpServer);

    rawHttpServer.listen(env.PORT, () => {
      utils.logger('info', `🚀 Server is up and running in ${env.NODE_ENV} mode`);
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
