import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { healthCheck } from './config/oracle.js';
import { logger } from './logger.js';
import { requestLogger } from './api/middleware/requestLogger.js';
import { errorHandler } from './api/middleware/errorHandler.js';
import { createV1Router, type V1RouterDeps } from './api/v1/index.js';

export interface AppDeps {
  v1?: V1RouterDeps;
}

export function createApp(deps: AppDeps = {}) {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '2mb' }));
  app.use(requestLogger);

  app.get('/health', async (_req, res) => {
    let oracleHealthy = false;

    try {
      oracleHealthy = await healthCheck();
    } catch (err) {
      logger.warn({ err }, 'Health check failed (pool not initialized?)');
      oracleHealthy = false;
    }

    res.json({ status: 'ok', oracle: oracleHealthy });
  });

  app.use('/api/v1', createV1Router(deps.v1));

  app.use((_req, res) => {
    res.status(404).json({ error: { message: 'Not found', code: 'NOT_FOUND' } });
  });

  app.use(errorHandler);

  return app;
}
