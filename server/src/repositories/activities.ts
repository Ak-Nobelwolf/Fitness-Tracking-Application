import { getPool } from '../config/oracle.js';
import { logger } from '../logger.js';

export interface Activity {
  id: string;
  ownerId: string;
  activityTypeId: string;
  startTime: Date;
  endTime: Date;
  durationMinutes: number;
  caloriesBurned: number;
  caloriesOverride?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateActivityInput {
  id: string;
  ownerId: string;
  activityTypeId: string;
  startTime: Date | string;
  endTime: Date | string;
  durationMinutes: number;
  caloriesBurned: number;
  caloriesOverride?: number;
  notes?: string;
}

export async function createActivity(input: CreateActivityInput): Promise<Activity> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    const startTime = typeof input.startTime === 'string' ? new Date(input.startTime) : input.startTime;
    const endTime = typeof input.endTime === 'string' ? new Date(input.endTime) : input.endTime;

    await connection.execute(
      `INSERT INTO activities 
       (id, owner_id, activity_type_id, start_time, end_time, duration_minutes, calories_burned, calories_override, notes, created_at, updated_at)
       VALUES (:id, :ownerId, :activityTypeId, :startTime, :endTime, :durationMinutes, :caloriesBurned, :caloriesOverride, :notes, SYSDATE, SYSDATE)`,
      {
        id: input.id,
        ownerId: input.ownerId,
        activityTypeId: input.activityTypeId,
        startTime,
        endTime,
        durationMinutes: input.durationMinutes,
        caloriesBurned: input.caloriesBurned,
        caloriesOverride: input.caloriesOverride || null,
        notes: input.notes || null,
      }
    );

    await connection.commit();
    logger.debug({ activityId: input.id }, 'Activity created');

    return {
      id: input.id,
      ownerId: input.ownerId,
      activityTypeId: input.activityTypeId,
      startTime,
      endTime,
      durationMinutes: input.durationMinutes,
      caloriesBurned: input.caloriesBurned,
      caloriesOverride: input.caloriesOverride,
      notes: input.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (err) {
    logger.error({ err, activityId: input.id }, 'Error creating activity');
    throw err;
  } finally {
    await connection.close();
  }
}

export async function getActivityById(id: string): Promise<Activity | null> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    const result = await connection.execute(
      `SELECT id, owner_id, activity_type_id, start_time, end_time, duration_minutes, calories_burned, calories_override, notes, created_at, updated_at
       FROM activities WHERE id = :id`,
      { id }
    );

    if (result.rows && result.rows.length > 0) {
      const row = result.rows[0] as any[];
      return {
        id: row[0],
        ownerId: row[1],
        activityTypeId: row[2],
        startTime: new Date(row[3]),
        endTime: new Date(row[4]),
        durationMinutes: row[5],
        caloriesBurned: row[6],
        caloriesOverride: row[7] || undefined,
        notes: row[8] || undefined,
        createdAt: new Date(row[9]),
        updatedAt: new Date(row[10]),
      };
    }

    return null;
  } catch (err) {
    logger.error({ err, activityId: id }, 'Error fetching activity');
    throw err;
  } finally {
    await connection.close();
  }
}

export async function getActivitiesByOwnerId(ownerId: string): Promise<Activity[]> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    const result = await connection.execute(
      `SELECT id, owner_id, activity_type_id, start_time, end_time, duration_minutes, calories_burned, calories_override, notes, created_at, updated_at
       FROM activities WHERE owner_id = :ownerId ORDER BY start_time DESC`,
      { ownerId }
    );

    if (!result.rows) {
      return [];
    }

    return result.rows.map((row: any) => ({
      id: (row as any[])[0],
      ownerId: (row as any[])[1],
      activityTypeId: (row as any[])[2],
      startTime: new Date((row as any[])[3]),
      endTime: new Date((row as any[])[4]),
      durationMinutes: (row as any[])[5],
      caloriesBurned: (row as any[])[6],
      caloriesOverride: (row as any[])[7] || undefined,
      notes: (row as any[])[8] || undefined,
      createdAt: new Date((row as any[])[9]),
      updatedAt: new Date((row as any[])[10]),
    }));
  } catch (err) {
    logger.error({ err, ownerId }, 'Error fetching activities by owner');
    throw err;
  } finally {
    await connection.close();
  }
}

export async function updateActivity(id: string, updates: Partial<CreateActivityInput>): Promise<Activity> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    const existing = await getActivityById(id);
    if (!existing) {
      throw new Error(`Activity not found: ${id}`);
    }

    const startTime = updates.startTime
      ? typeof updates.startTime === 'string'
        ? new Date(updates.startTime)
        : updates.startTime
      : existing.startTime;

    const endTime = updates.endTime
      ? typeof updates.endTime === 'string'
        ? new Date(updates.endTime)
        : updates.endTime
      : existing.endTime;

    await connection.execute(
      `UPDATE activities
       SET activity_type_id = :activityTypeId,
           start_time = :startTime,
           end_time = :endTime,
           duration_minutes = :durationMinutes,
           calories_burned = :caloriesBurned,
           calories_override = :caloriesOverride,
           notes = :notes,
           updated_at = SYSDATE
       WHERE id = :id`,
      {
        id,
        activityTypeId: updates.activityTypeId || existing.activityTypeId,
        startTime,
        endTime,
        durationMinutes: updates.durationMinutes ?? existing.durationMinutes,
        caloriesBurned: updates.caloriesBurned ?? existing.caloriesBurned,
        caloriesOverride: updates.caloriesOverride ?? existing.caloriesOverride ?? null,
        notes: updates.notes ?? existing.notes ?? null,
      }
    );

    await connection.commit();
    logger.debug({ activityId: id }, 'Activity updated');

    return {
      ...existing,
      ...updates,
      startTime,
      endTime,
      updatedAt: new Date(),
    } as Activity;
  } catch (err) {
    logger.error({ err, activityId: id }, 'Error updating activity');
    throw err;
  } finally {
    await connection.close();
  }
}

export async function deleteActivity(id: string): Promise<void> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.execute(
      `DELETE FROM activities WHERE id = :id`,
      { id }
    );
    await connection.commit();

    logger.debug({ activityId: id }, 'Activity deleted');
  } catch (err) {
    logger.error({ err, activityId: id }, 'Error deleting activity');
    throw err;
  } finally {
    await connection.close();
  }
}
