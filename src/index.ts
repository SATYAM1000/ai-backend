import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { middlewares } from '@/middlewares';

import { env } from '@/config';
import { projectsRouter, userRouter, workspaceRouter } from '@/routes';
import helmet from 'helmet';
import compression from 'compression';
import hpp from 'hpp';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(hpp());
app.use(compression());

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
app.use('/api/v1/workspace', workspaceRouter);
app.use('/api/v1/projects', projectsRouter);

app.use(middlewares.notFoundHandler);

app.use(middlewares.errorHandler);

export default app;
