import { getPool } from '../config/oracle.js';
import { logger } from '../logger.js';
import { startOfDay, startOfWeek, startOfMonth, endOfDay, endOfWeek, endOfMonth } from 'date-fns';

export interface DailyStats {
  date: Date;
  totalCalories: number;
  totalDuration: number;
  activitiesCount: number;
}

export interface WeeklyStats {
  weekStart: Date;
  weekEnd: Date;
  totalCalories: number;
  totalDuration: number;
  activitiesCount: number;
  daily: DailyStats[];
}

export interface MonthlyStats {
  monthStart: Date;
  monthEnd: Date;
  totalCalories: number;
  totalDuration: number;
  activitiesCount: number;
  weekly: WeeklyStats[];
}

/**
 * Get daily stats for a specific date.
 */
export async function getDailyStats(ownerId: string, date: Date = new Date()): Promise<DailyStats> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const result = await connection.execute(
      `SELECT 
        COALESCE(SUM(CASE WHEN calories_override IS NOT NULL THEN calories_override ELSE calories_burned END), 0) as total_calories,
        COALESCE(SUM(duration_minutes), 0) as total_duration,
        COUNT(*) as activities_count
       FROM activities
       WHERE owner_id = :ownerId
       AND start_time >= :dayStart
       AND start_time < :dayEnd`,
      { ownerId, dayStart, dayEnd }
    );

    const row = result.rows?.[0] as any[];
    return {
      date: dayStart,
      totalCalories: row?.[0] ?? 0,
      totalDuration: row?.[1] ?? 0,
      activitiesCount: row?.[2] ?? 0,
    };
  } catch (err) {
    logger.error({ err, ownerId, date }, 'Error fetching daily stats');
    throw err;
  } finally {
    await connection.close();
  }
}

/**
 * Get weekly stats for a specific date (includes that week).
 */
export async function getWeeklyStats(ownerId: string, date: Date = new Date()): Promise<WeeklyStats> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    const weekStart = startOfWeek(date);
    const weekEnd = endOfWeek(date);

    const result = await connection.execute(
      `SELECT 
        COALESCE(SUM(CASE WHEN calories_override IS NOT NULL THEN calories_override ELSE calories_burned END), 0) as total_calories,
        COALESCE(SUM(duration_minutes), 0) as total_duration,
        COUNT(*) as activities_count
       FROM activities
       WHERE owner_id = :ownerId
       AND start_time >= :weekStart
       AND start_time < :weekEnd`,
      { ownerId, weekStart, weekEnd }
    );

    const row = result.rows?.[0] as any[];

    // Get daily breakdown
    const daily: DailyStats[] = [];
    for (let d = new Date(weekStart); d < weekEnd; d.setDate(d.getDate() + 1)) {
      const dayStats = await getDailyStats(ownerId, d);
      daily.push(dayStats);
    }

    return {
      weekStart,
      weekEnd,
      totalCalories: row?.[0] ?? 0,
      totalDuration: row?.[1] ?? 0,
      activitiesCount: row?.[2] ?? 0,
      daily,
    };
  } catch (err) {
    logger.error({ err, ownerId, date }, 'Error fetching weekly stats');
    throw err;
  } finally {
    await connection.close();
  }
}

/**
 * Get monthly stats for a specific date (includes that month).
 */
export async function getMonthlyStats(ownerId: string, date: Date = new Date()): Promise<MonthlyStats> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);

    const result = await connection.execute(
      `SELECT 
        COALESCE(SUM(CASE WHEN calories_override IS NOT NULL THEN calories_override ELSE calories_burned END), 0) as total_calories,
        COALESCE(SUM(duration_minutes), 0) as total_duration,
        COUNT(*) as activities_count
       FROM activities
       WHERE owner_id = :ownerId
       AND start_time >= :monthStart
       AND start_time < :monthEnd`,
      { ownerId, monthStart, monthEnd }
    );

    const row = result.rows?.[0] as any[];

    // Get weekly breakdown
    const weekly: WeeklyStats[] = [];
    let currentDate = new Date(monthStart);
    while (currentDate < monthEnd) {
      const weekStats = await getWeeklyStats(ownerId, currentDate);
      weekly.push(weekStats);
      currentDate.setDate(currentDate.getDate() + 7);
    }

    return {
      monthStart,
      monthEnd,
      totalCalories: row?.[0] ?? 0,
      totalDuration: row?.[1] ?? 0,
      activitiesCount: row?.[2] ?? 0,
      weekly,
    };
  } catch (err) {
    logger.error({ err, ownerId, date }, 'Error fetching monthly stats');
    throw err;
  } finally {
    await connection.close();
  }
}
