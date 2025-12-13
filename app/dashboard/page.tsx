'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useOwnerId } from '@/components/Providers';
import { Card, CardHeader } from '@/components/ui/Card';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { DailyAggregate, WeeklyAggregate, MonthlyAggregate, ActivityTypeMix } from '@/lib/types';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function DashboardPage() {
  const { ownerId } = useOwnerId();

  const { data: dailyData = [], isLoading: isLoadingDaily } = useQuery<DailyAggregate[]>({
    queryKey: ['dashboard', 'daily', ownerId],
    queryFn: () => api.dashboard.daily(ownerId),
  });

  const { data: weeklyData = [], isLoading: isLoadingWeekly } = useQuery<WeeklyAggregate[]>({
    queryKey: ['dashboard', 'weekly', ownerId],
    queryFn: () => api.dashboard.weekly(ownerId),
  });

  const { data: monthlyData = [], isLoading: isLoadingMonthly } = useQuery<MonthlyAggregate[]>({
    queryKey: ['dashboard', 'monthly', ownerId],
    queryFn: () => api.dashboard.monthly(ownerId),
  });

  const { data: activityMixData = [], isLoading: isLoadingMix } = useQuery<ActivityTypeMix[]>({
    queryKey: ['dashboard', 'activityMix', ownerId],
    queryFn: () => api.dashboard.activityTypeMix(ownerId),
  });

  const isLoading = isLoadingDaily || isLoadingWeekly || isLoadingMonthly || isLoadingMix;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  const totalCalories = dailyData.reduce((sum: number, day) => sum + (day.totalCalories || 0), 0);
  const totalDuration = dailyData.reduce((sum: number, day) => sum + (day.totalDurationMinutes || 0), 0);
  const totalActivities = dailyData.reduce((sum: number, day) => sum + (day.activityCount || 0), 0);

  const dailyChartData = dailyData.map((day) => ({
    date: format(parseISO(day.activityDate), 'MMM dd'),
    calories: day.totalCalories || 0,
    duration: day.totalDurationMinutes || 0,
  }));

  const weeklyChartData = weeklyData.map((week) => ({
    week: `${format(parseISO(week.weekStart), 'MMM dd')} - ${format(parseISO(week.weekEnd), 'dd')}`,
    calories: week.totalCalories || 0,
    activities: week.activityCount || 0,
  }));

  const monthlyChartData = monthlyData.map((month) => ({
    month: format(parseISO(month.monthStart), 'MMM yyyy'),
    calories: month.totalCalories || 0,
    duration: month.totalDurationMinutes || 0,
  }));

  const pieChartData = activityMixData.map((activity) => ({
    name: activity.activityTypeName,
    value: activity.totalCalories || 0,
  }));

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Total Calories Burned</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {Math.round(totalCalories).toLocaleString()}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">kcal</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Total Duration</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {Math.round(totalDuration / 60)}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">hours</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Total Activities</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {totalActivities}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">logged</p>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Daily Calories Burned" subtitle="Last 30 days" />
        {dailyChartData.length === 0 ? (
          <p className="text-center text-zinc-500 dark:text-zinc-400 py-8">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="calories" fill="#3b82f6" name="Calories" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card>
        <CardHeader title="Weekly Trend" subtitle="Calories burned per week" />
        {weeklyChartData.length === 0 ? (
          <p className="text-center text-zinc-500 dark:text-zinc-400 py-8">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="calories" stroke="#10b981" name="Calories" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Monthly Overview" subtitle="Calories by month" />
          {monthlyChartData.length === 0 ? (
            <p className="text-center text-zinc-500 dark:text-zinc-400 py-8">No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="calories" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} name="Calories" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <CardHeader title="Activity Type Mix" subtitle="Calories by activity type" />
          {pieChartData.length === 0 ? (
            <p className="text-center text-zinc-500 dark:text-zinc-400 py-8">No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
    </div>
  );
}
