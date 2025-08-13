import express from 'express';
import { middlewares } from '@/middlewares';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(middlewares.request);

app.use(); // error handler middleware

export default app;
