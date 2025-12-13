import { getPool } from '../config/oracle.js';
import { logger } from '../logger.js';

export interface Owner {
  ownerId: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

type OwnerRow = [string, string | null, Date, Date];

function mapRowToOwner(row: OwnerRow): Owner {
  return {
    ownerId: row[0],
    email: row[1] ?? undefined,
    createdAt: new Date(row[2]),
    updatedAt: new Date(row[3]),
  };
}

export async function createOwner(ownerId: string, email?: string): Promise<Owner> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.execute(
      `INSERT INTO owners (owner_id, email, created_at, updated_at) 
       VALUES (:ownerId, :email, SYSTIMESTAMP, SYSTIMESTAMP)`,
      { ownerId, email: email ?? null }
    );
    await connection.commit();

    logger.debug({ ownerId }, 'Owner created');

    return {
      ownerId,
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (err) {
    logger.error({ err, ownerId }, 'Error creating owner');
    throw err;
  } finally {
    await connection.close();
  }
}

export async function getOwnerById(ownerId: string): Promise<Owner | null> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    const result = await connection.execute<OwnerRow>(
      `SELECT owner_id, email, created_at, updated_at 
       FROM owners WHERE owner_id = :ownerId`,
      { ownerId }
    );

    if (result.rows && result.rows.length > 0) {
      return mapRowToOwner(result.rows[0]);
    }

    return null;
  } catch (err) {
    logger.error({ err, ownerId }, 'Error fetching owner');
    throw err;
  } finally {
    await connection.close();
  }
}

export async function getAllOwners(): Promise<Owner[]> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    const result = await connection.execute<OwnerRow>(
      `SELECT owner_id, email, created_at, updated_at 
       FROM owners ORDER BY created_at DESC`
    );

    if (!result.rows) {
      return [];
    }

    return result.rows.map(mapRowToOwner);
  } catch (err) {
    logger.error({ err }, 'Error fetching all owners');
    throw err;
  } finally {
    await connection.close();
  }
}

export async function deleteOwner(ownerId: string): Promise<void> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.execute(`DELETE FROM owners WHERE owner_id = :ownerId`, { ownerId });
    await connection.commit();

    logger.debug({ ownerId }, 'Owner deleted');
  } catch (err) {
    logger.error({ err, ownerId }, 'Error deleting owner');
    throw err;
  } finally {
    await connection.close();
  }
}
