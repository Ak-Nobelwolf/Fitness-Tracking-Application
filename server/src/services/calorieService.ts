import { getActivityTypeById } from '../repositories/activityTypes.js';
import { getProfileByOwnerId } from '../repositories/ownerProfiles.js';
import { logger } from '../logger.js';

export interface CalorieCalculationResult {
  calculatedCalories: number;
  actualCalories: number;
  isOverridden: boolean;
  met: number;
  weight: number;
  durationHours: number;
}

/**
 * Calculate calories burned using the MET × weight × duration formula.
 * Formula: MET × weight (kg) × duration (hours) = calories burned
 * 
 * @param ownerId - The owner/user ID
 * @param activityTypeId - The activity type ID (which contains MET value)
 * @param durationMinutes - Duration of activity in minutes
 * @param overrideCalories - Optional manual override for calculated calories
 * @returns CalorieCalculationResult with calculated and actual calories
 */
export async function calculateCalories(
  ownerId: string,
  activityTypeId: string,
  durationMinutes: number,
  overrideCalories?: number
): Promise<CalorieCalculationResult> {
  try {
    const [activityType, profile] = await Promise.all([
      getActivityTypeById(activityTypeId),
      getProfileByOwnerId(ownerId),
    ]);

    if (!activityType) {
      throw new Error(`Activity type not found: ${activityTypeId}`);
    }

    if (!profile) {
      throw new Error(`Owner profile not found: ${ownerId}`);
    }

    const durationHours = durationMinutes / 60;
    const calculatedCalories = activityType.met * profile.weight * durationHours;

    const actualCalories = overrideCalories !== undefined ? overrideCalories : calculatedCalories;

    logger.debug(
      {
        ownerId,
        activityTypeId,
        durationMinutes,
        met: activityType.met,
        weight: profile.weight,
        calculatedCalories,
        overrideCalories,
        actualCalories,
      },
      'Calories calculated'
    );

    return {
      calculatedCalories: Math.round(calculatedCalories * 100) / 100,
      actualCalories: Math.round(actualCalories * 100) / 100,
      isOverridden: overrideCalories !== undefined,
      met: activityType.met,
      weight: profile.weight,
      durationHours,
    };
  } catch (err) {
    logger.error({ err, ownerId, activityTypeId }, 'Error calculating calories');
    throw err;
  }
}

/**
 * Validate if override calories are significantly different from calculated.
 * Returns true if difference is > 10% (warning flag).
 */
export function isCalorieOverrideSuspicious(
  calculatedCalories: number,
  overrideCalories: number,
  threshold: number = 0.1
): boolean {
  if (calculatedCalories === 0) {
    return overrideCalories !== 0;
  }

  const percentDifference = Math.abs(overrideCalories - calculatedCalories) / calculatedCalories;
  return percentDifference > threshold;
}
