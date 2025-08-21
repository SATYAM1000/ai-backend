import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';
import hpp from 'hpp';

import { utils } from '@/utils';
import { env } from '@/config';
import { middlewares } from '@/middlewares';
import { assetsRouter, projectsRouter, userRouter, workspaceRouter } from '@/routes';

const app = express();

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
  statusCode: 429,
  handler: (req, _res, next) => {
    return utils.httpError(next, new Error('Too many requests'), req, 429);
  },
});

app.set('trust proxy', 1);
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(hpp());
app.use(compression());
app.use(rateLimiter);

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    origin: [env.FRONTEND_URL],
    credentials: true,
  }),
);

app.use(middlewares.requestHandler);

app.use('/api/v1/auth', userRouter);
app.use('/api/v1/workspaces', workspaceRouter);
app.use('/api/v1/projects', projectsRouter);
app.use('/api/v1/assets', assetsRouter);

app.use(middlewares.notFoundHandler);

app.use(middlewares.errorHandler);

export default app;
