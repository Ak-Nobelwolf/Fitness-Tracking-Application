import { getPool } from '../config/oracle.js';
import { logger } from '../logger.js';

export interface ActivityType {
  ownerId: string;
  activityTypeId: string;
  name: string;
  met: number;
  createdAt: Date;
  updatedAt: Date;
}

type ActivityTypeRow = [string, string, string, number, Date, Date];

function mapRowToActivityType(row: ActivityTypeRow): ActivityType {
  return {
    ownerId: row[0],
    activityTypeId: row[1],
    name: row[2],
    met: row[3],
    createdAt: new Date(row[4]),
    updatedAt: new Date(row[5]),
  };
}

export async function createActivityType(type: ActivityType): Promise<ActivityType> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.execute(
      `INSERT INTO activity_types (owner_id, activity_type_id, name, met, created_at, updated_at) 
       VALUES (:ownerId, :activityTypeId, :name, :met, SYSTIMESTAMP, SYSTIMESTAMP)`,
      {
        ownerId: type.ownerId,
        activityTypeId: type.activityTypeId,
        name: type.name,
        met: type.met,
      }
    );

    await connection.commit();
    logger.debug({ ownerId: type.ownerId, activityTypeId: type.activityTypeId }, 'Activity type created');

    return { ...type, createdAt: new Date(), updatedAt: new Date() };
  } catch (err) {
    logger.error({ err, ownerId: type.ownerId, activityTypeId: type.activityTypeId }, 'Error creating activity type');
    throw err;
  } finally {
    await connection.close();
  }
}

export async function getActivityTypeById(ownerId: string, activityTypeId: string): Promise<ActivityType | null> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    const result = await connection.execute<ActivityTypeRow>(
      `SELECT owner_id, activity_type_id, name, met, created_at, updated_at 
       FROM activity_types WHERE owner_id = :ownerId AND activity_type_id = :activityTypeId`,
      { ownerId, activityTypeId }
    );

    if (result.rows && result.rows.length > 0) {
      return mapRowToActivityType(result.rows[0]);
    }

    return null;
  } catch (err) {
    logger.error({ err, ownerId, activityTypeId }, 'Error fetching activity type');
    throw err;
  } finally {
    await connection.close();
  }
}

export async function getAllActivityTypes(ownerId: string): Promise<ActivityType[]> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    const result = await connection.execute<ActivityTypeRow>(
      `SELECT owner_id, activity_type_id, name, met, created_at, updated_at 
       FROM activity_types WHERE owner_id = :ownerId ORDER BY name`,
      { ownerId }
    );

    if (!result.rows) {
      return [];
    }

    return result.rows.map(mapRowToActivityType);
  } catch (err) {
    logger.error({ err, ownerId }, 'Error fetching all activity types');
    throw err;
  } finally {
    await connection.close();
  }
}

export async function updateActivityType(
  ownerId: string,
  activityTypeId: string,
  updates: Partial<ActivityType>
): Promise<ActivityType> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    const existing = await getActivityTypeById(ownerId, activityTypeId);
    if (!existing) {
      throw new Error(`Activity type not found: ${activityTypeId}`);
    }

    const updated = { ...existing, ...updates, ownerId, activityTypeId };

    await connection.execute(
      `UPDATE activity_types 
       SET name = :name, met = :met, updated_at = SYSTIMESTAMP
       WHERE owner_id = :ownerId AND activity_type_id = :activityTypeId`,
      {
        ownerId,
        activityTypeId,
        name: updated.name,
        met: updated.met,
      }
    );

    await connection.commit();
    logger.debug({ ownerId, activityTypeId }, 'Activity type updated');

    return { ...updated, updatedAt: new Date() };
  } catch (err) {
    logger.error({ err, ownerId, activityTypeId }, 'Error updating activity type');
    throw err;
  } finally {
    await connection.close();
  }
}

export async function deleteActivityType(ownerId: string, activityTypeId: string): Promise<void> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.execute(
      `DELETE FROM activity_types WHERE owner_id = :ownerId AND activity_type_id = :activityTypeId`,
      { ownerId, activityTypeId }
    );
    await connection.commit();

    logger.debug({ ownerId, activityTypeId }, 'Activity type deleted');
  } catch (err) {
    logger.error({ err, ownerId, activityTypeId }, 'Error deleting activity type');
    throw err;
  } finally {
    await connection.close();
  }
}
