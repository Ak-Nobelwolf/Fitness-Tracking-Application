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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select
        label="Activity Type"
        {...register('activityTypeId')}
        error={errors.activityTypeId?.message}
        options={[{ value: '', label: 'Select activity type...' }, ...activityTypeOptions]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Start Time"
          type="datetime-local"
          {...register('startTime')}
          error={errors.startTime?.message}
        />

        <Input
          label="End Time"
          type="datetime-local"
          {...register('endTime')}
          error={errors.endTime?.message}
        />
      </div>

      <Input
        label="Duration (minutes)"
        type="number"
        {...register('durationMinutes')}
        error={errors.durationMinutes?.message}
        helperText="Auto-calculated from start/end time"
      />

      <Select
        label="Intensity"
        {...register('intensity')}
        error={errors.intensity?.message}
        options={[
          { value: 'low', label: 'Low' },
          { value: 'moderate', label: 'Moderate' },
          { value: 'high', label: 'High' },
        ]}
      />

      <div className="space-y-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register('useManualCalories')}
            className="rounded border-zinc-300 dark:border-zinc-600"
          />
          <span className="text-sm text-zinc-700 dark:text-zinc-300">Manual calorie override</span>
        </label>

        {useManualCalories && (
          <Input
            label="Calories"
            type="number"
            {...register('caloriesOverride')}
            error={errors.caloriesOverride?.message}
            placeholder="Enter manual calorie value"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Notes
        </label>
        <textarea
          {...register('notes')}
          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          rows={3}
          placeholder="Add any notes about this activity..."
        />
        {errors.notes && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.notes.message}</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Update Activity' : 'Add Activity'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
