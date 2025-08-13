import path from 'path';
import fs from 'fs';
import util from 'util';
import { createLogger, format, transports, Logger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { red, blue, yellow, green, magenta } from 'colorette';
import { env } from '@/config/env.config';
import 'winston-mongodb';

const colorizeLevel = (level: string): string => {
  switch (level) {
    case 'error':
      return red(level);
    case 'info':
      return blue(level);
    case 'warn':
      return yellow(level);
    default:
      return level;
  }
};

const consoleLogFormat = format.printf((info) => {
  const {
    level,
    message,
    timestamp,
    meta = {},
  } = info as {
    level: string;
    message: string;
    timestamp: string;
    meta?: Record<string, unknown>;
  };

  const customLevel = colorizeLevel(level.toLowerCase());
  const customTimestamp = green(timestamp);
  const customMessage = message;

  const customMeta = util.inspect(meta, {
    showHidden: false,
    depth: null,
    colors: true,
  });

  return `${customLevel} [${customTimestamp}] ${customMessage}\n${magenta('META')} ${customMeta}\n`;
});

const consoleTransport = () => {
  if (env.NODE_ENV === 'development') {
    return [
      new transports.Console({
        level: 'info',
        format: format.combine(format.timestamp(), consoleLogFormat),
      }),
    ];
  }
  return [];
};

const fileLogFormat = format.printf((info) => {
  const {
    level,
    message,
    timestamp,
    meta = {},
  } = info as {
    level: string;
    message: string;
    timestamp: string;
    meta?: Record<string, unknown>;
  };

  const logMeta: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(meta)) {
    if (value instanceof Error) {
      logMeta[key] = {
        name: value.name,
        message: value.message,
        trace: value.stack || '',
      };
    } else {
      logMeta[key] = value;
    }
  }

  const logData = {
    level: level.toUpperCase(),
    message,
    timestamp,
    meta: logMeta,
  };

  return JSON.stringify(logData, null, 4);
});

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const dailyRotateFileTransport = () => [
  new DailyRotateFile({
    filename: path.join(logsDir, '%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'info',
    format: format.combine(format.timestamp(), fileLogFormat),
    maxFiles: '2d',
  }),
];

const mongodbTransport = () => [
  new transports.MongoDB({
    level: 'info',
    db: env.MONGO_URI_LOGS,
    metaKey: 'meta',
    expireAfterSeconds: 3600 * 24 * 15, // 15 days
    options: {
      useUnifiedTopology: true,
    },
    collection: 'application-logs',
  }),
];

export const logger: Logger = createLogger({
  defaultMeta: { meta: {} },
  transports: [...dailyRotateFileTransport(), ...consoleTransport(), ...mongodbTransport()],
});
