'use client';

import { format } from 'date-fns';
import { Activity } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ActivityHistoryListProps {
  activities: Activity[];
  onEdit?: (activity: Activity) => void;
  onDelete?: (activityId: string) => void;
}

export function ActivityHistoryList({ activities, onEdit, onDelete }: ActivityHistoryListProps) {
  if (activities.length === 0) {
    return (
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border-2 border-dashed border-primary/20 p-12 text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
          <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <p className="text-muted-foreground text-lg">No activities found. Add your first activity to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activities.map((activity, index) => (
        <div
          key={activity.activityId}
          className="bg-gradient-to-br from-white to-white/50 dark:from-zinc-900 dark:to-zinc-900/50 rounded-2xl shadow-lg hover:shadow-2xl p-6 transition-all duration-300 border border-primary/10 hover:border-primary/30 transform hover:scale-[1.02]"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {activity.activityTypeName?.charAt(0)?.toUpperCase() || 'A'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    {activity.activityTypeName || 'Unknown Activity'}
                  </h3>
                </div>
                {activity.calorieSource === 'override' && (
                  <Badge variant="warning" className="bg-gradient-to-r from-warning to-warning/80 text-white">
                    ⚡ Manual Override
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-3 border border-primary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-medium text-muted-foreground">Date</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {format(new Date(activity.activityDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl p-3 border border-secondary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="h-4 w-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs font-medium text-muted-foreground">Duration</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {activity.durationMinutes} min
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-xl p-3 border border-success/20">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs font-medium text-muted-foreground">Time</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {format(new Date(activity.startedAt), 'HH:mm')} - {format(new Date(activity.endedAt), 'HH:mm')}
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-warning/10 to-warning/5 rounded-xl p-3 border border-warning/20">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="h-4 w-4 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                    <span className="text-xs font-medium text-muted-foreground">Calories</span>
                  </div>
                  <p className="text-lg font-bold bg-gradient-to-r from-warning to-warning/80 bg-clip-text text-transparent">
                    {Math.round(activity.calories)} kcal
                  </p>
                </div>
              </div>

              {activity.notes && (
                <div className="bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl p-4 border border-border">
                  <div className="flex items-start gap-2">
                    <svg className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Notes</p>
                      <p className="text-sm text-foreground">{activity.notes}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {(onEdit || onDelete) && (
              <div className="flex sm:flex-col gap-3">
                {onEdit && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onEdit(activity)}
                    className="flex-1 sm:flex-none bg-gradient-to-r from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 border-2 border-primary/30 text-primary"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDelete(activity.activityId)}
                    className="flex-1 sm:flex-none"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
