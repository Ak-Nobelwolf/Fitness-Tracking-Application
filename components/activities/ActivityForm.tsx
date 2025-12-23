'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { activityFormSchema, ActivityFormData } from '@/lib/validation';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ActivityType } from '@/lib/types';

interface ActivityFormProps {
  activityTypes: ActivityType[];
  onSubmit: (data: ActivityFormData) => void;
  onCancel: () => void;
  initialData?: Partial<ActivityFormData>;
  isLoading?: boolean;
}

export function ActivityForm({ activityTypes, onSubmit, onCancel, initialData, isLoading }: ActivityFormProps) {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<ActivityFormData>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: initialData || {
      intensity: 'moderate',
      useManualCalories: false,
    },
  });

  const startTime = watch('startTime');
  const endTime = watch('endTime');
  const useManualCalories = watch('useManualCalories');

  useEffect(() => {
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      if (end > start) {
        const minutes = Math.round((end.getTime() - start.getTime()) / 60000);
        setValue('durationMinutes', minutes);
      }
    }
  }, [startTime, endTime, setValue]);

  const activityTypeOptions = activityTypes.map(type => ({
    value: type.activityTypeId,
    label: `${type.name} (${type.met} MET)`,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Select
        label="Activity Type"
        {...register('activityTypeId')}
        error={errors.activityTypeId?.message}
        options={[{ value: '', label: 'Select activity type...' }, ...activityTypeOptions]}
        className="border-2 border-primary/20 focus:border-primary focus:ring-primary/20"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          label="Start Time"
          type="datetime-local"
          {...register('startTime')}
          error={errors.startTime?.message}
          className="border-2 border-primary/20 focus:border-primary focus:ring-primary/20"
        />

        <Input
          label="End Time"
          type="datetime-local"
          {...register('endTime')}
          error={errors.endTime?.message}
          className="border-2 border-primary/20 focus:border-primary focus:ring-primary/20"
        />
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 border border-primary/20">
        <Input
          label="Duration (minutes)"
          type="number"
          {...register('durationMinutes')}
          error={errors.durationMinutes?.message}
          helperText="Auto-calculated from start/end time"
          className="border-2 border-primary/20 focus:border-primary focus:ring-primary/20 bg-white/50"
        />
      </div>

      <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-xl p-4 border border-secondary/20">
        <Select
          label="Intensity"
          {...register('intensity')}
          error={errors.intensity?.message}
          options={[
            { value: 'low', label: '🟢 Low' },
            { value: 'moderate', label: '🟡 Moderate' },
            { value: 'high', label: '🔴 High' },
          ]}
          className="border-2 border-secondary/20 focus:border-secondary focus:ring-secondary/20 bg-white/50"
        />
      </div>

      <div className="space-y-4">
        <label className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-primary/20 cursor-pointer hover:from-primary/10 hover:to-secondary/10 transition-colors">
          <input
            type="checkbox"
            {...register('useManualCalories')}
            className="h-5 w-5 rounded border-primary/30 text-primary focus:ring-primary/20"
          />
          <span className="text-sm font-medium text-foreground">Manual calorie override</span>
        </label>

        {useManualCalories && (
          <div className="bg-gradient-to-r from-warning/10 to-warning/5 rounded-xl p-4 border border-warning/30">
            <Input
              label="Calories"
              type="number"
              {...register('caloriesOverride')}
              error={errors.caloriesOverride?.message}
              placeholder="Enter manual calorie value"
              className="border-2 border-warning/30 focus:border-warning focus:ring-warning/20 bg-white/70"
            />
          </div>
        )}
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-foreground mb-2">
          Notes
        </label>
        <div className="relative">
          <textarea
            {...register('notes')}
            className="w-full px-4 py-3 border-2 border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gradient-to-br from-white/50 to-white/30 text-foreground placeholder-muted-foreground resize-none transition-all"
            rows={4}
            placeholder="Add any notes about this activity... How did you feel? What was the weather like?"
          />
          <div className="absolute top-2 right-2 text-xs text-muted-foreground">
            {watch('notes')?.length || 0}/500
          </div>
        </div>
        {errors.notes && (
          <p className="mt-1 text-sm text-error font-medium">{errors.notes.message}</p>
        )}
      </div>

      <div className="flex gap-4 pt-6 border-t border-border">
        <Button 
          type="submit" 
          isLoading={isLoading}
          className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          {initialData ? '✨ Update Activity' : '⚡ Add Activity'}
        </Button>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onCancel}
          className="bg-gradient-to-r from-secondary/20 to-secondary/10 hover:from-secondary/30 hover:to-secondary/20 border-2 border-secondary/30 text-secondary-foreground"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
