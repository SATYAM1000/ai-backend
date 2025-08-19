import Redis from 'ioredis';
import { env } from '@/config';
import { utils } from '@/utils';

const redisClient = new Redis({
  host: env.REDIS_HOST,
  port: Number(env.REDIS_PORT),
  username: env.REDIS_USERNAME,
  password: env.REDIS_PASSWORD,
  db: 0,
  tls: env.NODE_ENV === 'production' ? {} : undefined,
  lazyConnect: true,
  maxRetriesPerRequest: null,
  connectTimeout: 10000,
  retryStrategy: (times) => Math.min(times * 50, 2000),
  reconnectOnError: (error) => {
    utils.logger('error', `❌ REDIS_ERROR: ${error.message}`);
    if (error.message.includes('READONLY')) return true;
    return false;
  },
});

redisClient.on('error', (err) => utils.logger('error', `❌ Redis Error: ${err.message}`));
redisClient.on('end', () => utils.logger('warn', '⚠️ Redis connection closed'));
redisClient.on('reconnecting', () => utils.logger('info', '🔄 Reconnecting to Redis...'));

async function initRedisClient() {
  try {
    await redisClient.connect();
    utils.logger('info', '✅ Redis connected successfully');
  } catch (err: unknown) {
    utils.logger('error', `❌ Failed to connect Redis: ${JSON.stringify(err)}`);
    process.exit(1);
  }
}

export type RedisClient = typeof redisClient;

export { redisClient, initRedisClient };
