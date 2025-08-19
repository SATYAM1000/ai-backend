import app from '.';
import {
  connectToLogsDB,
  connectToMainDB,
  disconnectFromDB,
  env,
  initRedisClient,
  redisClient,
} from '@/config';
import { initEmailQueue } from '@/queues/email.queue';
import { initEmailWorker } from '@/workers/email.worker';
import { utils } from '@/utils';

(async function startServer() {
  try {
    await Promise.all([connectToMainDB(), connectToLogsDB(), initRedisClient()]);
    utils.logger('info', '✅ All services connected (DB + Redis)');
    
    // Initialize BullMQ components after Redis is connected
    try {
      initEmailQueue();
      utils.logger('info', '✅ Email queue initialized');
      initEmailWorker();
      utils.logger('info', '✅ Email worker initialized');
      utils.logger('info', '✅ BullMQ components initialized');
    } catch (bullmqError) {
      console.error('BullMQ Error Details:', bullmqError);
      utils.logger('error', '❌ Failed to initialize BullMQ components', {
        error: bullmqError instanceof Error ? bullmqError.stack : bullmqError,
        message: bullmqError instanceof Error ? bullmqError.message : 'Unknown error',
      });
      throw bullmqError;
    }

    app.listen(env.PORT, () => {
      utils.logger('info', `🚀 Server running on http://localhost:${env.PORT}`);
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
