'use client';

import { format } from 'date-fns';
import { Activity } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ActivityHistoryListProps {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (activityId: string) => void;
}

export function ActivityHistoryList({ activities, onEdit, onDelete }: ActivityHistoryListProps) {
  if (activities.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-8 text-center">
        <p className="text-zinc-500 dark:text-zinc-400">No activities found. Add your first activity to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.activityId}
          className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {activity.activityTypeName || 'Unknown Activity'}
                </h3>
                {activity.calorieSource === 'override' && (
                  <Badge variant="warning">Manual Override</Badge>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <div>
                  <span className="font-medium">Date:</span>{' '}
                  {format(new Date(activity.activityDate), 'MMM dd, yyyy')}
                </div>
                <div>
                  <span className="font-medium">Duration:</span>{' '}
                  {activity.durationMinutes} minutes
                </div>
                <div>
                  <span className="font-medium">Time:</span>{' '}
                  {format(new Date(activity.startedAt), 'HH:mm')} - {format(new Date(activity.endedAt), 'HH:mm')}
                </div>
                <div>
                  <span className="font-medium">Calories:</span>{' '}
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">
                    {Math.round(activity.calories)} kcal
                  </span>
                </div>
              </div>

              {activity.notes && (
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                  <span className="font-medium">Notes:</span> {activity.notes}
                </div>
              )}
            </div>

            <div className="flex sm:flex-col gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onEdit(activity)}
                className="flex-1 sm:flex-none"
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => onDelete(activity.activityId)}
                className="flex-1 sm:flex-none"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
