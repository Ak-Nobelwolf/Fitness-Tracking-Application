import { getPool } from '../config/oracle.js';
import { logger } from '../logger.js';

export interface OwnerProfile {
  ownerId: string;
  weight: number;
  height?: number;
  age?: number;
  gender?: string;
  updatedAt: Date;
}

export async function createProfile(profile: OwnerProfile): Promise<OwnerProfile> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.execute(
      `INSERT INTO owner_profiles (owner_id, weight, height, age, gender, updated_at) 
       VALUES (:ownerId, :weight, :height, :age, :gender, SYSDATE)`,
      {
        ownerId: profile.ownerId,
        weight: profile.weight,
        height: profile.height || null,
        age: profile.age || null,
        gender: profile.gender || null,
      }
    );

    await connection.commit();
    logger.debug({ ownerId: profile.ownerId }, 'Owner profile created');

    return { ...profile, updatedAt: new Date() };
  } catch (err) {
    logger.error({ err, ownerId: profile.ownerId }, 'Error creating owner profile');
    throw err;
  } finally {
    await connection.close();
  }
}

export async function getProfileByOwnerId(ownerId: string): Promise<OwnerProfile | null> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    const result = await connection.execute(
      `SELECT owner_id, weight, height, age, gender, updated_at 
       FROM owner_profiles WHERE owner_id = :ownerId`,
      { ownerId }
    );

    if (result.rows && result.rows.length > 0) {
      const row = result.rows[0] as any[];
      return {
        ownerId: row[0],
        weight: row[1],
        height: row[2] || undefined,
        age: row[3] || undefined,
        gender: row[4] || undefined,
        updatedAt: new Date(row[5]),
      };
    }

    return null;
  } catch (err) {
    logger.error({ err, ownerId }, 'Error fetching owner profile');
    throw err;
  } finally {
    await connection.close();
  }
}

export async function updateProfile(ownerId: string, updates: Partial<OwnerProfile>): Promise<OwnerProfile> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    const existingProfile = await getProfileByOwnerId(ownerId);
    if (!existingProfile) {
      throw new Error(`Profile not found for owner ${ownerId}`);
    }

    const updated = { ...existingProfile, ...updates, ownerId };

    await connection.execute(
      `UPDATE owner_profiles 
       SET weight = :weight, height = :height, age = :age, gender = :gender, updated_at = SYSDATE
       WHERE owner_id = :ownerId`,
      {
        ownerId,
        weight: updated.weight,
        height: updated.height || null,
        age: updated.age || null,
        gender: updated.gender || null,
      }
    );

    await connection.commit();
    logger.debug({ ownerId }, 'Owner profile updated');

    return { ...updated, updatedAt: new Date() };
  } catch (err) {
    logger.error({ err, ownerId }, 'Error updating owner profile');
    throw err;
  } finally {
    await connection.close();
  }
}

export async function deleteProfile(ownerId: string): Promise<void> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.execute(
      `DELETE FROM owner_profiles WHERE owner_id = :ownerId`,
      { ownerId }
    );
    await connection.commit();

    logger.debug({ ownerId }, 'Owner profile deleted');
  } catch (err) {
    logger.error({ err, ownerId }, 'Error deleting owner profile');
    throw err;
  } finally {
    await connection.close();
  }
}
