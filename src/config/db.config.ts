import mongoose, { Connection } from 'mongoose';
import { env } from '@/config';
import { utils } from '@/utils';

const globalConns = global as typeof globalThis & {
  mainDB?: Connection;
  logsDB?: Connection;
};

export const connectToMainDB = async () => {
  if (globalConns.mainDB) return globalConns.mainDB;

  try {
    const conn = await mongoose.connect(env.MONGO_URI_MAIN);
    globalConns.mainDB = conn.connection;
    utils.logger('info', 'Connected to Main MongoDB', { host: conn.connection.host });
    return conn.connection;
  } catch (error) {
    utils.logger('error', 'Failed to connect to Main MongoDB', {
      error: error instanceof Error ? error.stack : error,
    });
    process.exit(1);
  }
};

export const connectToLogsDB = async () => {
  if (globalConns.logsDB) return globalConns.logsDB;

  try {
    const conn = await mongoose.createConnection(env.MONGO_URI_LOGS).asPromise();
    globalConns.logsDB = conn;
    utils.logger('info', 'Connected to Logs MongoDB', { host: conn.host });
    return conn;
  } catch (error) {
    utils.logger('error', 'Failed to connect to Logs MongoDB', {
      error: error instanceof Error ? error.stack : error,
    });
    process.exit(1);
  }
};
