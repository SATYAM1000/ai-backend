import { Server } from 'socket.io';
import http from 'http';
import { env } from '@/config';
import { utils } from '@/utils';

let io: Server | null = null;

export const initSocketIO = (
  httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>,
) => {
  if (io) return io;

  io = new Server(httpServer, {
    cors: {
      origin: env.FRONTEND_URL,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    utils.logger('info', `🔌 User connected: ${socket.id}`);

    socket.on('message', (message) => {
      socket.broadcast.emit('message', message);
    });

    socket.on('disconnect', () => {
      utils.logger('info', `🔌 User disconnected: ${socket.id}`);
    });
  });

  utils.logger('info', '✅ Socket.IO initialized');
  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io not initialized! Call initSocketIO first.');
  }
  return io;
};
