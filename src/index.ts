import express from 'express';
import { middlewares } from '@/middlewares';
import userRouter from '@/routes/auth.route';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(middlewares.requestHandler);

app.use('/api/v1/auth', userRouter);

app.use(middlewares.notFoundHandler);

app.use(middlewares.errorHandler);

export default app;
