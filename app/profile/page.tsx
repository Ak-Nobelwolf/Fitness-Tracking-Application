'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { profileSchema, ProfileFormData, checkWarnings } from '@/lib/validation';
import { api } from '@/lib/api';
import { useOwnerId } from '@/components/Providers';
import { Card, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Warning } from '@/components/ui/Warning';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { OwnerProfile } from '@/lib/types';

const timezones = Intl.supportedValuesOf('timeZone').map(tz => ({ value: tz, label: tz }));

export default function ProfilePage() {
  const { ownerId } = useOwnerId();
  const queryClient = useQueryClient();
  const [warnings, setWarnings] = useState<string[]>([]);
  const [showWarnings, setShowWarnings] = useState(false);

  const { data: profile, isLoading } = useQuery<OwnerProfile>({
    queryKey: ['profile', ownerId],
    queryFn: () => api.profile.get(ownerId),
  });

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: profile ? {
      displayName: profile.displayName || '',
      weightKg: profile.weightKg || 70,
      heightCm: profile.heightCm || 170,
      timezone: profile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      dailyCalorieGoal: profile.dailyCalorieGoal || 2000,
      defaultIntensity: (profile.defaultIntensity as 'low' | 'moderate' | 'high' | undefined) || 'moderate',
    } : undefined,
  });

  const mutation = useMutation({
    mutationFn: (data: ProfileFormData) => api.profile.upsert(ownerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', ownerId] });
      setShowWarnings(false);
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    const warningMessages = checkWarnings(data);
    if (warningMessages.length > 0 && !showWarnings) {
      setWarnings(warningMessages);
      setShowWarnings(true);
      return;
    }
    mutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <Card>
        <CardHeader title="Profile Settings" subtitle="Manage your personal information and preferences" />
        
        {showWarnings && <Warning messages={warnings} onDismiss={() => setShowWarnings(false)} />}
        
        {mutation.isSuccess && (
          <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 p-4 mb-4">
            <p className="text-sm text-green-800 dark:text-green-200">Profile updated successfully!</p>
          </div>
        )}

        {mutation.isError && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 mb-4">
            <p className="text-sm text-red-800 dark:text-red-200">
              Failed to update profile. Please try again.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Display Name"
            {...register('displayName')}
            error={errors.displayName?.message}
            placeholder="Enter your name"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Weight (kg)"
              type="number"
              step="0.1"
              {...register('weightKg')}
              error={errors.weightKg?.message}
              placeholder="70"
            />

            <Input
              label="Height (cm)"
              type="number"
              step="0.1"
              {...register('heightCm')}
              error={errors.heightCm?.message}
              placeholder="170"
            />
          </div>

          <Select
            label="Timezone"
            {...register('timezone')}
            error={errors.timezone?.message}
            options={timezones}
          />

          <Input
            label="Daily Calorie Goal"
            type="number"
            {...register('dailyCalorieGoal')}
            error={errors.dailyCalorieGoal?.message}
            helperText="Your target daily calorie burn"
            placeholder="2000"
          />

          <Select
            label="Default Intensity"
            {...register('defaultIntensity')}
            error={errors.defaultIntensity?.message}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'moderate', label: 'Moderate' },
              { value: 'high', label: 'High' },
            ]}
          />

          <div className="flex gap-3">
            <Button type="submit" isLoading={mutation.isPending}>
              {showWarnings ? 'Save Anyway' : 'Save Profile'}
            </Button>
            {showWarnings && (
              <Button type="button" variant="secondary" onClick={() => setShowWarnings(false)}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
