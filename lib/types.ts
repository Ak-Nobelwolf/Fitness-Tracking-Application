export interface OwnerProfile {
  ownerId: string;
  displayName: string | null;
  weightKg: number | null;
  heightCm: number | null;
  timezone?: string;
  dailyCalorieGoal?: number;
  defaultIntensity?: string;
}

export interface ActivityType {
  activityTypeId: string;
  name: string;
  met: number;
}

export interface Activity {
  activityId: string;
  activityTypeId: string;
  activityDate: string;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  calories: number;
  calorieSource: 'calculated' | 'override';
  caloriesOverride?: number;
  notes?: string;
  activityTypeName?: string;
}

export interface DailyAggregate {
  activityDate: string;
  totalDurationMinutes: number;
  totalCalories: number;
  activityCount: number;
}

export interface WeeklyAggregate {
  weekStart: string;
  weekEnd: string;
  totalDurationMinutes: number;
  totalCalories: number;
  activityCount: number;
}

export interface MonthlyAggregate {
  monthStart: string;
  monthEnd: string;
  totalDurationMinutes: number;
  totalCalories: number;
  activityCount: number;
}

export interface ActivityTypeMix {
  activityTypeName: string;
  totalDurationMinutes: number;
  totalCalories: number;
  activityCount: number;
}

export interface OfflineActivity {
  id: string;
  data: Partial<Activity>;
  status: 'pending' | 'syncing' | 'synced' | 'error';
  timestamp: number;
  error?: string;
}
