import { v4 as uuidv4 } from 'uuid';
import { getPool } from '../config/oracle.js';
import { logger } from '../logger.js';

let cachedOwnerId: string | null = null;

/**
 * Get or create the owner ID (UUID).
 * This function generates a new UUID on first call and persists it to the database.
 * On subsequent calls, it retrieves the cached value.
 */
export async function getOwnerId(): Promise<string> {
  if (cachedOwnerId) {
    return cachedOwnerId;
  }

  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    // Try to fetch existing owner ID
    const result = await connection.execute(
      `SELECT id FROM owners WHERE id IS NOT NULL FETCH FIRST 1 ROW ONLY`
    );

    if (result.rows && result.rows.length > 0) {
      const ownerId = ((result.rows[0] as any[])[0] as string) || null;
      if (ownerId) {
        cachedOwnerId = ownerId;
        logger.debug({ ownerId: cachedOwnerId }, 'Retrieved existing owner ID');
        return cachedOwnerId;
      }
    }

    // Generate new UUID if none exists
    cachedOwnerId = uuidv4();
    await connection.execute(
      `INSERT INTO owners (id) VALUES (:id)`,
      { id: cachedOwnerId }
    );
    await connection.commit();

    logger.info({ ownerId: cachedOwnerId }, 'Created new owner ID');
    return cachedOwnerId;
  } catch (err) {
    logger.error({ err }, 'Error getting or creating owner ID');
    throw err;
  } finally {
    await connection.close();
  }
}

/**
 * Set the owner ID explicitly (useful for testing or admin operations).
 */
export function setOwnerId(id: string): void {
  cachedOwnerId = id;
}

/**
 * Clear the cached owner ID (useful for testing).
 */
export function clearOwnerId(): void {
  cachedOwnerId = null;
}
