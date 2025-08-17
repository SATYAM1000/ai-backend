import Redis from 'ioredis';
import { env } from '@/config';
import { utils } from '@/utils';

export const redis = new Redis({
  host: env.REDIS_HOST,
  port: parseInt(env.REDIS_PORT, 10),
  password: env.REDIS_PASSWORD,
  db: 0,
  maxRetriesPerRequest: 3,
  reconnectOnError: (error) => {
    const targetError = 'READONLY';
    utils.logger('error', `❌ REDIS_ERROR: ${error.message}`);
    if (error.message.includes(targetError)) {
      return true; // reconnect on cluster failover
    }
    return false;
  },
});
