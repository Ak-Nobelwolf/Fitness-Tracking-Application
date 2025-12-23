import { getPool } from '../config/oracle.js';
import { logger } from '../logger.js';
import oracledb from 'oracledb';

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

    if (!result.rows || result.rows.length === 0) {
      // If no activity types exist for this owner, seed default ones
      await seedDefaultActivityTypes(connection, ownerId);
      
      // Fetch again after seeding
      const seededResult = await connection.execute<ActivityTypeRow>(
        `SELECT owner_id, activity_type_id, name, met, created_at, updated_at 
         FROM activity_types WHERE owner_id = :ownerId ORDER BY name`,
        { ownerId }
      );

      if (!seededResult.rows) {
        return [];
      }

      return seededResult.rows.map(mapRowToActivityType);
    }

    return result.rows.map(mapRowToActivityType);
  } catch (err) {
    logger.error({ err, ownerId }, 'Error fetching all activity types');
    throw err;
  } finally {
    await connection.close();
  }
}

async function seedDefaultActivityTypes(connection: oracledb.Connection, ownerId: string): Promise<void> {
  const defaultActivityTypes = [
    // Walking & Running
    { name: 'Walking (2 mph)', met: 2.8, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1' },
    { name: 'Walking (3 mph)', met: 3.3, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2' },
    { name: 'Walking (4 mph)', met: 5.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3' },
    { name: 'Jogging (5 mph)', met: 8.3, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4' },
    { name: 'Running (6 mph)', met: 9.8, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5' },
    { name: 'Running (7 mph)', met: 11.5, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6' },
    { name: 'Running (8 mph)', met: 13.5, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7' },
    { name: 'Sprinting (10 mph)', met: 16.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa8' },
    
    // Cycling
    { name: 'Cycling (leisure)', met: 4.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa9' },
    { name: 'Cycling (moderate)', met: 7.5, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa10' },
    { name: 'Cycling (vigorous)', met: 10.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa11' },
    { name: 'Mountain Biking', met: 12.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa12' },
    
    // Swimming
    { name: 'Swimming (leisure)', met: 6.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa13' },
    { name: 'Swimming (moderate)', met: 8.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa14' },
    { name: 'Swimming (vigorous)', met: 10.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa15' },
    { name: 'Swimming (butterfly)', met: 13.8, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa16' },
    
    // Water Sports
    { name: 'Rowing (moderate)', met: 7.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa17' },
    { name: 'Kayaking', met: 5.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa18' },
    { name: 'Surfing', met: 3.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa19' },
    { name: 'Water Skiing', met: 7.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa20' },
    { name: 'Wakeboarding', met: 6.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa21' },
    { name: 'Windsurfing', met: 8.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa22' },
    
    // Ball Sports
    { name: 'Basketball (game)', met: 8.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa23' },
    { name: 'Soccer (game)', met: 7.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa24' },
    { name: 'Tennis (singles)', met: 8.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa25' },
    { name: 'Tennis (doubles)', met: 6.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa26' },
    { name: 'Badminton', met: 5.5, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa27' },
    { name: 'Cricket', met: 4.8, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa28' },
    { name: 'Volleyball', met: 6.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa29' },
    { name: 'Baseball', met: 5.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa30' },
    { name: 'Golf (walking)', met: 4.3, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa31' },
    { name: 'American Football', met: 8.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa32' },
    { name: 'Rugby', met: 10.3, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa33' },
    { name: 'Ice Hockey', met: 8.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa34' },
    
    // Racket Sports
    { name: 'Squash', met: 12.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa35' },
    { name: 'Racquetball', met: 8.5, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa36' },
    { name: 'Handball', met: 12.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa37' },
    
    // Precision Sports
    { name: 'Billiards', met: 2.5, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa38' },
    { name: 'Bowling', met: 3.8, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa39' },
    { name: 'Darts', met: 2.5, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa40' },
    
    // Outdoor Activities
    { name: 'Hiking (cross-country)', met: 6.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa41' },
    { name: 'Rock Climbing', met: 8.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa42' },
    { name: 'Skiing (downhill)', met: 7.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa43' },
    { name: 'Skiing (cross-country)', met: 9.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa44' },
    { name: 'Snowboarding', met: 7.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa45' },
    { name: 'Ice Skating', met: 7.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa46' },
    
    // Dance & Aerobics
    { name: 'Aerobics (low impact)', met: 5.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa47' },
    { name: 'Aerobics (high impact)', met: 7.5, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa48' },
    { name: 'Hip Hop Dancing', met: 5.5, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa49' },
    { name: 'Ballet', met: 5.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa50' },
    { name: 'Zumba', met: 7.5, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa51' },
    
    // Martial Arts
    { name: 'Boxing', met: 12.8, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa52' },
    { name: 'Karate', met: 10.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa53' },
    { name: 'Judo', met: 10.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa54' },
    { name: 'Taekwondo', met: 10.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa55' },
    { name: 'Muay Thai', met: 11.8, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa56' },
    { name: 'Tai Chi', met: 3.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa57' },
    { name: 'Wrestling', met: 6.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa58' },
    
    // Gym & Fitness
    { name: 'Weight Training', met: 6.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa59' },
    { name: 'Circuit Training', met: 8.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa60' },
    { name: 'Elliptical Trainer', met: 5.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa61' },
    { name: 'Stair Climber', met: 8.8, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa62' },
    { name: 'Treadmill (walking)', met: 3.5, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa63' },
    { name: 'Treadmill (running)', met: 9.8, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa64' },
    { name: 'Rowing Machine', met: 7.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa65' },
    { name: 'Stationary Bike', met: 7.5, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa66' },
    { name: 'Yoga (Hatha)', met: 2.5, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa67' },
    
    // Yoga & Meditation
    { name: 'Yoga (Power)', met: 4.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa68' },
    { name: 'Yoga (Bikram)', met: 4.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa69' },
    { name: 'Pilates', met: 3.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa70' },
    { name: 'Meditation', met: 1.3, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa71' },
    
    // Sports & Recreation
    { name: 'Frisbee', met: 3.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa72' },
    { name: 'Archery', met: 3.5, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa73' },
    { name: 'Fencing', met: 6.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa74' },
    { name: 'Gymnastics', met: 4.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa75' },
    { name: 'Cheerleading', met: 6.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa76' },
    { name: 'Skateboarding', met: 5.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa77' },
    { name: 'Rollerblading', met: 7.5, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa78' },
    
    // Walking & Climbing
    { name: 'Stair Climbing', met: 8.8, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa79' },
    { name: 'Ladder Climbing', met: 8.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa80' },
    { name: 'Rope Jumping', met: 11.0, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa81' },
  ];

  const insertPromises = defaultActivityTypes.map(activityType =>
    connection.execute(
      `INSERT INTO activity_types (owner_id, activity_type_id, name, met, created_at, updated_at) 
       VALUES (:ownerId, :activityTypeId, :name, :met, SYSTIMESTAMP, SYSTIMESTAMP)`,
      {
        ownerId,
        activityTypeId: activityType.id,
        name: activityType.name,
        met: activityType.met,
      }
    )
  );

  await Promise.all(insertPromises);
  await connection.commit();
  
  logger.info({ ownerId, count: defaultActivityTypes.length }, 'Seeded default activity types');
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
