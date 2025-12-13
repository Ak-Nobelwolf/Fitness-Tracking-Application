import oracledb from 'oracledb';
import { logger } from '../logger.js';

let pool: oracledb.Pool | null = null;

export interface OracleConfig {
  user: string;
  password: string;
  connectString: string;
  poolMin?: number;
  poolMax?: number;
  poolIncrement?: number;
}

export async function initializePool(config: OracleConfig): Promise<oracledb.Pool> {
  try {
    pool = await oracledb.createPool({
      user: config.user,
      password: config.password,
      connectString: config.connectString,
      poolMin: config.poolMin || 2,
      poolMax: config.poolMax || 10,
      poolIncrement: config.poolIncrement || 1,
    });

    logger.info('Oracle pool initialized successfully');
    return pool;
  } catch (err) {
    logger.error({ err }, 'Failed to initialize Oracle pool');
    throw err;
  }
}

export function getPool(): oracledb.Pool {
  if (!pool) {
    throw new Error('Oracle pool not initialized. Call initializePool first.');
  }
  return pool;
}

export async function closePool(): Promise<void> {
  if (pool) {
    try {
      await pool.close();
      pool = null;
      logger.info('Oracle pool closed successfully');
    } catch (err) {
      logger.error({ err }, 'Error closing Oracle pool');
      throw err;
    }
  }
}

export async function healthCheck(): Promise<boolean> {
  try {
    const connection = await getPool().getConnection();
    await connection.execute('SELECT 1 FROM DUAL');
    await connection.close();
    return true;
  } catch (err) {
    logger.error({ err }, 'Oracle health check failed');
    return false;
  }
}
