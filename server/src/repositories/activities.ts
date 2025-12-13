import type oracledb from 'oracledb';

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
  caloriesOverride?: number | null;
  notes?: string | null;
}

export interface BulkUpsertResult {
  id: string;
  action: 'created' | 'updated';
}

type ActivityRow = [
  string,
  string,
  string,
  Date,
  Date,
  number,
  number,
  number | null,
  string | null,
  Date,
  Date,
];

function toDate(value: Date | string): Date {
  return typeof value === 'string' ? new Date(value) : value;
}

function mapRowToActivity(row: ActivityRow): Activity {
  return {
    id: row[0],
    ownerId: row[1],
    activityTypeId: row[2],
    startTime: new Date(row[3]),
    endTime: new Date(row[4]),
    durationMinutes: row[5],
    caloriesBurned: row[6],
    caloriesOverride: row[7] ?? undefined,
    notes: row[8] ?? undefined,
    createdAt: new Date(row[9]),
    updatedAt: new Date(row[10]),
  };
}

async function getActivityByIdWithConnection(connection: oracledb.Connection, id: string): Promise<Activity | null> {
  const result = await connection.execute<ActivityRow>(
    `SELECT id, owner_id, activity_type_id, start_time, end_time, duration_minutes, calories_burned, calories_override, notes, created_at, updated_at
     FROM activities WHERE id = :id`,
    { id }
  );

  if (result.rows && result.rows.length > 0) {
    return mapRowToActivity(result.rows[0]);
  }

  return null;
}

export async function createActivity(input: CreateActivityInput): Promise<Activity> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    const startTime = toDate(input.startTime);
    const endTime = toDate(input.endTime);

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
        caloriesOverride: input.caloriesOverride ?? null,
        notes: input.notes ?? null,
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
      caloriesOverride: input.caloriesOverride ?? undefined,
      notes: input.notes ?? undefined,
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
    return await getActivityByIdWithConnection(connection, id);
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
    const result = await connection.execute<ActivityRow>(
      `SELECT id, owner_id, activity_type_id, start_time, end_time, duration_minutes, calories_burned, calories_override, notes, created_at, updated_at
       FROM activities WHERE owner_id = :ownerId ORDER BY start_time DESC`,
      { ownerId }
    );

    if (!result.rows) {
      return [];
    }

    return result.rows.map(mapRowToActivity);
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
    const existing = await getActivityByIdWithConnection(connection, id);
    if (!existing) {
      throw new Error(`Activity not found: ${id}`);
    }

    const startTime = Object.prototype.hasOwnProperty.call(updates, 'startTime')
      ? updates.startTime
        ? toDate(updates.startTime)
        : existing.startTime
      : existing.startTime;

    const endTime = Object.prototype.hasOwnProperty.call(updates, 'endTime')
      ? updates.endTime
        ? toDate(updates.endTime)
        : existing.endTime
      : existing.endTime;

    const hasCaloriesOverride = Object.prototype.hasOwnProperty.call(updates, 'caloriesOverride');
    const hasNotes = Object.prototype.hasOwnProperty.call(updates, 'notes');

    const caloriesOverride = hasCaloriesOverride ? (updates.caloriesOverride ?? null) : existing.caloriesOverride ?? null;
    const notes = hasNotes ? (updates.notes ?? null) : existing.notes ?? null;

    const activityTypeId = updates.activityTypeId || existing.activityTypeId;
    const durationMinutes = updates.durationMinutes ?? existing.durationMinutes;
    const caloriesBurned = updates.caloriesBurned ?? existing.caloriesBurned;

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
        activityTypeId,
        startTime,
        endTime,
        durationMinutes,
        caloriesBurned,
        caloriesOverride,
        notes,
      }
    );

    await connection.commit();
    logger.debug({ activityId: id }, 'Activity updated');

    return {
      ...existing,
      activityTypeId,
      startTime,
      endTime,
      durationMinutes,
      caloriesBurned,
      caloriesOverride: caloriesOverride ?? undefined,
      notes: notes ?? undefined,
      updatedAt: new Date(),
    };
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
    await connection.execute(`DELETE FROM activities WHERE id = :id`, { id });
    await connection.commit();

    logger.debug({ activityId: id }, 'Activity deleted');
  } catch (err) {
    logger.error({ err, activityId: id }, 'Error deleting activity');
    throw err;
  } finally {
    await connection.close();
  }
}

export async function bulkUpsertActivities(items: CreateActivityInput[]): Promise<BulkUpsertResult[]> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    const results: BulkUpsertResult[] = [];

    for (const item of items) {
      const existing = await getActivityByIdWithConnection(connection, item.id);
      const startTime = toDate(item.startTime);
      const endTime = toDate(item.endTime);

      if (existing) {
        if (existing.ownerId !== item.ownerId) {
          throw new Error(`Activity owner mismatch for ${item.id}`);
        }

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
            id: item.id,
            activityTypeId: item.activityTypeId,
            startTime,
            endTime,
            durationMinutes: item.durationMinutes,
            caloriesBurned: item.caloriesBurned,
            caloriesOverride: item.caloriesOverride ?? null,
            notes: item.notes ?? null,
          }
        );

        results.push({ id: item.id, action: 'updated' });
      } else {
        await connection.execute(
          `INSERT INTO activities 
           (id, owner_id, activity_type_id, start_time, end_time, duration_minutes, calories_burned, calories_override, notes, created_at, updated_at)
           VALUES (:id, :ownerId, :activityTypeId, :startTime, :endTime, :durationMinutes, :caloriesBurned, :caloriesOverride, :notes, SYSDATE, SYSDATE)`,
          {
            id: item.id,
            ownerId: item.ownerId,
            activityTypeId: item.activityTypeId,
            startTime,
            endTime,
            durationMinutes: item.durationMinutes,
            caloriesBurned: item.caloriesBurned,
            caloriesOverride: item.caloriesOverride ?? null,
            notes: item.notes ?? null,
          }
        );

        results.push({ id: item.id, action: 'created' });
      }
    }

    await connection.commit();
    logger.debug({ count: items.length }, 'Bulk upsert activities complete');

    return results;
  } catch (err) {
    logger.error({ err }, 'Error bulk upserting activities');
    throw err;
  } finally {
    await connection.close();
  }
}
