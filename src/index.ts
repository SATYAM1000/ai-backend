import express from 'express';
import { envConfig } from './config';

const app = express();
app.use(express.json());

app.use(); // error handler middleware

export default app;
