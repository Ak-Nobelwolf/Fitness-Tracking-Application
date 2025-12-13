import { getPool } from '../config/oracle.js';
import { logger } from '../logger.js';

export interface OwnerProfile {
  ownerId: string;
  displayName?: string;
  weightKg?: number;
  heightCm?: number;
  createdAt: Date;
  updatedAt: Date;
}

type OwnerProfileRow = [string, string | null, number | null, number | null, Date, Date];

function mapRowToOwnerProfile(row: OwnerProfileRow): OwnerProfile {
  return {
    ownerId: row[0],
    displayName: row[1] ?? undefined,
    weightKg: row[2] ?? undefined,
    heightCm: row[3] ?? undefined,
    createdAt: new Date(row[4]),
    updatedAt: new Date(row[5]),
  };
}

export async function createProfile(profile: OwnerProfile): Promise<OwnerProfile> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.execute(
      `INSERT INTO owner_profiles (owner_id, display_name, weight_kg, height_cm, created_at, updated_at) 
       VALUES (:ownerId, :displayName, :weightKg, :heightCm, SYSTIMESTAMP, SYSTIMESTAMP)`,
      {
        ownerId: profile.ownerId,
        displayName: profile.displayName ?? null,
        weightKg: profile.weightKg ?? null,
        heightCm: profile.heightCm ?? null,
      }
    );

    await connection.commit();
    logger.debug({ ownerId: profile.ownerId }, 'Owner profile created');

    return { ...profile, createdAt: new Date(), updatedAt: new Date() };
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
    const result = await connection.execute<OwnerProfileRow>(
      `SELECT owner_id, display_name, weight_kg, height_cm, created_at, updated_at 
       FROM owner_profiles WHERE owner_id = :ownerId`,
      { ownerId }
    );

    if (result.rows && result.rows.length > 0) {
      return mapRowToOwnerProfile(result.rows[0]);
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
       SET display_name = :displayName, weight_kg = :weightKg, height_cm = :heightCm, updated_at = SYSTIMESTAMP
       WHERE owner_id = :ownerId`,
      {
        ownerId,
        displayName: updated.displayName ?? null,
        weightKg: updated.weightKg ?? null,
        heightCm: updated.heightCm ?? null,
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
    await connection.execute(`DELETE FROM owner_profiles WHERE owner_id = :ownerId`, { ownerId });
    await connection.commit();

    logger.debug({ ownerId }, 'Owner profile deleted');
  } catch (err) {
    logger.error({ err, ownerId }, 'Error deleting owner profile');
    throw err;
  } finally {
    await connection.close();
  }
}
