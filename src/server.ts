import app from '.';
import {
  connectToLogsDB,
  connectToMainDB,
  disconnectFromDB,
  env,
  initRedisClient,
  redisClient,
} from '@/config';
import { utils } from '@/utils';

(async function startServer() {
  try {
    await Promise.all([connectToMainDB(), connectToLogsDB(), initRedisClient()]);
    utils.logger('info', '✅ All services connected (DB + Redis)');

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
