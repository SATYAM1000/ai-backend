import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { middlewares } from '@/middlewares';
import userRouter from '@/routes/auth.route';
import { env } from '@/config';

const app = express();
app.use(express.json());
app.use(cookieParser());

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

app.use(middlewares.notFoundHandler);

app.use(middlewares.errorHandler);

export default app;
