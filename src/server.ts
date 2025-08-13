import app from '.';
import { connectToLogsDB, connectToMainDB, env } from '@/config';
import { utils } from '@/utils';

(async function startServer() {
  try {
    await Promise.all([connectToMainDB(), connectToLogsDB()]);
    app.listen(env.PORT, () => {
      utils.logger('info', `🚀 Server running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    utils.logger('error', '❌ Failed to start server', {
      error: error instanceof Error ? error.stack : error,
    });
    process.exit(1);
  }
})();
