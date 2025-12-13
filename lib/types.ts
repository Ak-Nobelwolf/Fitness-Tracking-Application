export interface OwnerProfile {
  ownerId: string;
  displayName?: string;
  weightKg?: number;
  heightCm?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityType {
  activityTypeId: string;
  ownerId: string;
  name: string;
  met: number;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  activityId: string;
  ownerId: string;
  activityTypeId: string;
  activityDate: string;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  calories: number;
  calorieSource: "calculated" | "override";
  caloriesOverride?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyAggregate {
  date: string;
  totalActivities: number;
  totalDuration: number;
  totalCalories: number;
}

export interface WeeklyAggregate {
  weekStart: string;
  weekEnd: string;
  totalActivities: number;
  totalDuration: number;
  totalCalories: number;
}

export interface MonthlyAggregate {
  month: string;
  totalActivities: number;
  totalDuration: number;
  totalCalories: number;
}
