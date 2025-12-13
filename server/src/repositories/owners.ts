import { getPool } from '../config/oracle.js';
import { logger } from '../logger.js';

export interface Owner {
  id: string;
  createdAt: Date;
}

export async function createOwner(id: string): Promise<Owner> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    const result = await connection.execute(
      `INSERT INTO owners (id, created_at) VALUES (:id, SYSDATE) RETURNING id, created_at INTO :outId, :outCreatedAt`,
      { id, outId: { type: 2002, dir: 3001 }, outCreatedAt: { type: 2002, dir: 3001 } }
    );

    await connection.commit();

    const outBinds = result.outBinds as any;
    logger.debug({ ownerId: id }, 'Owner created');

    return {
      id,
      createdAt: new Date(),
    };
  } catch (err) {
    logger.error({ err, ownerId: id }, 'Error creating owner');
    throw err;
  } finally {
    await connection.close();
  }
}

export async function getOwnerById(id: string): Promise<Owner | null> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    const result = await connection.execute(
      `SELECT id, created_at FROM owners WHERE id = :id`,
      { id }
    );

    if (result.rows && result.rows.length > 0) {
      const row = result.rows[0] as any[];
      return {
        id: row[0],
        createdAt: new Date(row[1]),
      };
    }

    return null;
  } catch (err) {
    logger.error({ err, ownerId: id }, 'Error fetching owner');
    throw err;
  } finally {
    await connection.close();
  }
}

export async function getAllOwners(): Promise<Owner[]> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    const result = await connection.execute(
      `SELECT id, created_at FROM owners ORDER BY created_at DESC`
    );

    if (!result.rows) {
      return [];
    }

    return result.rows.map((row: any) => ({
      id: (row as any[])[0],
      createdAt: new Date((row as any[])[1]),
    }));
  } catch (err) {
    logger.error({ err }, 'Error fetching all owners');
    throw err;
  } finally {
    await connection.close();
  }
}

export async function deleteOwner(id: string): Promise<void> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.execute(
      `DELETE FROM owners WHERE id = :id`,
      { id }
    );
    await connection.commit();

    logger.debug({ ownerId: id }, 'Owner deleted');
  } catch (err) {
    logger.error({ err, ownerId: id }, 'Error deleting owner');
    throw err;
  } finally {
    await connection.close();
  }
}
