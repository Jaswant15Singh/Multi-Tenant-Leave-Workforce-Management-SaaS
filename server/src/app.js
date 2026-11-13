import express from 'express';
import dotenv from 'dotenv';
dotenv.config()
import { requestLogger } from './shared/middleware/requestLogger.js';
// import { healthRouter } from './health/health.routes.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(requestLogger);
  app.use(express.json({ limit: '100kb' }));

//   app.use('/health', healthRouter);

  return app;
}
