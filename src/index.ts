import express from 'express';
import { middlewares } from '@/middlewares';
import userRouter from './routes/auth.route';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(middlewares.request);

app.use('/api/v1/auth', userRouter);
app.use(middlewares.error);

export default app;
