import { z } from 'zod';

export const profileSchema = z.object({
  displayName: z.string().min(1, 'Display name is required').max(100),
  weightKg: z.number().min(20, 'Weight must be at least 20 kg').max(500, 'Weight must be at most 500 kg'),
  heightCm: z.number().min(50, 'Height must be at least 50 cm').max(300, 'Height must be at most 300 cm'),
  timezone: z.string().optional(),
  dailyCalorieGoal: z.number().min(500).max(10000).optional(),
  defaultIntensity: z.enum(['low', 'moderate', 'high']).optional(),
});

export const activityFormSchema = z.object({
  activityTypeId: z.string().min(1, 'Activity type is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  durationMinutes: z.number().min(1, 'Duration must be at least 1 minute'),
  intensity: z.enum(['low', 'moderate', 'high']).optional(),
  notes: z.string().max(500).optional(),
  useManualCalories: z.boolean().optional(),
  caloriesOverride: z.number().min(0).max(10000).optional(),
}).refine((data) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  return start < end;
}, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type ActivityFormData = z.infer<typeof activityFormSchema>;

export function checkWarnings(data: ProfileFormData): string[] {
  const warnings: string[] = [];
  
  if (data.weightKg < 40 || data.weightKg > 200) {
    warnings.push('Weight is outside typical range (40-200 kg)');
  }
  
  if (data.heightCm < 140 || data.heightCm > 220) {
    warnings.push('Height is outside typical range (140-220 cm)');
  }
  
  if (data.dailyCalorieGoal && (data.dailyCalorieGoal < 1200 || data.dailyCalorieGoal > 5000)) {
    warnings.push('Daily calorie goal is outside typical range (1200-5000)');
  }
  
  return warnings;
}
