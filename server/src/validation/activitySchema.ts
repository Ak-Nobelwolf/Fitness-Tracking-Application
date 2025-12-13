import { z } from 'zod';

export interface ValidationFlags {
  duration?: string;
  timeRange?: string;
  calories?: string;
}

export interface ValidatedActivity {
  data: ActivityInput;
  flags: ValidationFlags;
}

export const activitySchema = z.object({
  activityTypeId: z.string().uuid('Invalid activity type ID'),
  ownerId: z.string().uuid('Invalid owner ID'),
  startTime: z.date().or(z.string().datetime()),
  endTime: z.date().or(z.string().datetime()),
  durationMinutes: z.number().positive('Duration must be greater than 0'),
  caloriesBurned: z.number().nonnegative('Calories cannot be negative'),
  notes: z.string().optional(),
});

export interface ActivityInput {
  activityTypeId: string;
  ownerId: string;
  startTime: Date | string;
  endTime: Date | string;
  durationMinutes: number;
  caloriesBurned: number;
  notes?: string;
}

export interface ActivityValidationConfig {
  minCalories: number;
  maxCalories: number;
}

const defaultConfig: ActivityValidationConfig = {
  minCalories: 0,
  maxCalories: 10000,
};

/**
 * Validate activity input and return validation flags for soft warnings.
 */
export function validateActivity(
  activity: ActivityInput,
  config: ActivityValidationConfig = defaultConfig
): ValidatedActivity {
  const flags: ValidationFlags = {};

  // Validate duration is positive
  if (activity.durationMinutes <= 0) {
    flags.duration = 'Duration must be greater than 0';
  }

  // Validate time range
  const startTime = typeof activity.startTime === 'string' 
    ? new Date(activity.startTime) 
    : activity.startTime;
  const endTime = typeof activity.endTime === 'string' 
    ? new Date(activity.endTime) 
    : activity.endTime;

  if (startTime >= endTime) {
    flags.timeRange = 'Start time must be before end time';
  }

  // Validate calories are within configured bounds
  if (activity.caloriesBurned < config.minCalories || activity.caloriesBurned > config.maxCalories) {
    flags.calories = `Calories should be between ${config.minCalories} and ${config.maxCalories}`;
  }

  return {
    data: activity,
    flags,
  };
}

/**
 * Parse and validate activity data using Zod schema.
 */
export function parseActivity(data: unknown) {
  return activitySchema.parse(data);
}
