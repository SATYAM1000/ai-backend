import express from 'express';
import { middlewares } from '@/middlewares';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(middlewares.request);

// TODO: Add error handler middleware here
// app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

export default app;
