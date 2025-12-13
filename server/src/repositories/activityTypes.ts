import { getPool } from '../config/oracle.js';
import { logger } from '../logger.js';

export interface ActivityType {
  id: string;
  name: string;
  met: number;
  description?: string;
  createdAt: Date;
}

type ActivityTypeRow = [string, string, number, string | null, Date];

function mapRowToActivityType(row: ActivityTypeRow): ActivityType {
  return {
    id: row[0],
    name: row[1],
    met: row[2],
    description: row[3] ?? undefined,
    createdAt: new Date(row[4]),
  };
}

export async function createActivityType(type: ActivityType): Promise<ActivityType> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.execute(
      `INSERT INTO activity_types (id, name, met, description, created_at) 
       VALUES (:id, :name, :met, :description, SYSDATE)`,
      {
        id: type.id,
        name: type.name,
        met: type.met,
        description: type.description ?? null,
      }
    );

    await connection.commit();
    logger.debug({ activityTypeId: type.id }, 'Activity type created');

    return { ...type, createdAt: new Date() };
  } catch (err) {
    logger.error({ err, activityTypeId: type.id }, 'Error creating activity type');
    throw err;
  } finally {
    await connection.close();
  }
}

export async function getActivityTypeById(id: string): Promise<ActivityType | null> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    const result = await connection.execute<ActivityTypeRow>(
      `SELECT id, name, met, description, created_at 
       FROM activity_types WHERE id = :id`,
      { id }
    );

    if (result.rows && result.rows.length > 0) {
      return mapRowToActivityType(result.rows[0]);
    }

    return null;
  } catch (err) {
    logger.error({ err, activityTypeId: id }, 'Error fetching activity type');
    throw err;
  } finally {
    await connection.close();
  }
}

export async function getAllActivityTypes(): Promise<ActivityType[]> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    const result = await connection.execute<ActivityTypeRow>(
      `SELECT id, name, met, description, created_at 
       FROM activity_types ORDER BY name`
    );

    if (!result.rows) {
      return [];
    }

    return result.rows.map(mapRowToActivityType);
  } catch (err) {
    logger.error({ err }, 'Error fetching all activity types');
    throw err;
  } finally {
    await connection.close();
  }
}

export async function updateActivityType(id: string, updates: Partial<ActivityType>): Promise<ActivityType> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    const existing = await getActivityTypeById(id);
    if (!existing) {
      throw new Error(`Activity type not found: ${id}`);
    }

    const updated = { ...existing, ...updates, id };

    await connection.execute(
      `UPDATE activity_types 
       SET name = :name, met = :met, description = :description
       WHERE id = :id`,
      {
        id,
        name: updated.name,
        met: updated.met,
        description: updated.description ?? null,
      }
    );

    await connection.commit();
    logger.debug({ activityTypeId: id }, 'Activity type updated');

    return updated;
  } catch (err) {
    logger.error({ err, activityTypeId: id }, 'Error updating activity type');
    throw err;
  } finally {
    await connection.close();
  }
}

export async function deleteActivityType(id: string): Promise<void> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.execute(`DELETE FROM activity_types WHERE id = :id`, { id });
    await connection.commit();

    logger.debug({ activityTypeId: id }, 'Activity type deleted');
  } catch (err) {
    logger.error({ err, activityTypeId: id }, 'Error deleting activity type');
    throw err;
  } finally {
    await connection.close();
  }
}
