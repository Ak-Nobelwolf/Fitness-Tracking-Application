import 'dotenv/config';

import { createApp } from './app.js';
import { initializePool, closePool } from './config/oracle.js';
import { logger } from './logger.js';

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function parseOptionalInt(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number.parseInt(value, 10);
  return Number.isNaN(n) ? undefined : n;
}

const port = parseOptionalInt(process.env.PORT) ?? 3001;

await initializePool({
  user: requiredEnv('ORACLE_USER'),
  password: requiredEnv('ORACLE_PASSWORD'),
  connectString: requiredEnv('ORACLE_CONNECT_STRING'),
  poolMin: parseOptionalInt(process.env.ORACLE_POOL_MIN),
  poolMax: parseOptionalInt(process.env.ORACLE_POOL_MAX),
  poolIncrement: parseOptionalInt(process.env.ORACLE_POOL_INCREMENT),
});

const app = createApp();

const server = app.listen(port, () => {
  logger.info({ port }, 'API listening');
});

async function shutdown(signal: string) {
  logger.info({ signal }, 'Shutting down');

  server.close(async (err) => {
    if (err) {
      logger.error({ err }, 'Error closing HTTP server');
    }

    try {
      await closePool();
    } catch (poolErr) {
      logger.error({ err: poolErr }, 'Error closing Oracle pool');
    }

    process.exit(err ? 1 : 0);
  });
}

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});
process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});
