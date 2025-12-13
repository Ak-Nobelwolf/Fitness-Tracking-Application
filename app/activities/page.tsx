'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useOwnerId } from '@/components/Providers';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { ActivityForm } from '@/components/activities/ActivityForm';
import { ActivityFilters } from '@/components/activities/ActivityFilters';
import { ActivityHistoryList } from '@/components/activities/ActivityHistoryList';
import { Activity, ActivityType } from '@/lib/types';
import { ActivityFormData } from '@/lib/validation';
import { format } from 'date-fns';

export default function ActivitiesPage() {
  const { ownerId } = useOwnerId();
  const queryClient = useQueryClient();
  const { addToQueue, isOnline } = useOfflineQueue();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  
  const [filters, setFilters] = useState({
    search: '',
    activityType: '',
    dateFrom: '',
    dateTo: '',
  });

  const { data: activityTypes = [], isLoading: isLoadingTypes } = useQuery<ActivityType[]>({
    queryKey: ['activityTypes', ownerId],
    queryFn: () => api.activityTypes.list(ownerId),
  });

  const { data: activities = [], isLoading: isLoadingActivities } = useQuery<Activity[]>({
    queryKey: ['activities', ownerId],
    queryFn: () => api.activities.list(ownerId),
  });

  const createMutation = useMutation({
    mutationFn: async (data: ActivityFormData) => {
      if (!isOnline) {
        addToQueue(data);
        throw new Error('OFFLINE');
      }
      return api.activities.create(ownerId, {
        activityTypeId: data.activityTypeId,
        startTime: data.startTime,
        endTime: data.endTime,
        durationMinutes: data.durationMinutes,
        caloriesOverride: data.useManualCalories ? data.caloriesOverride : undefined,
        notes: data.notes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities', ownerId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', ownerId] });
      setIsAddModalOpen(false);
    },
    onError: (error: Error) => {
      if (error.message !== 'OFFLINE') {
        alert('Failed to create activity. Please try again.');
      } else {
        setIsAddModalOpen(false);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ActivityFormData) => {
      if (!selectedActivity) throw new Error('No activity selected');
      return api.activities.update(ownerId, selectedActivity.activityId, {
        activityTypeId: data.activityTypeId,
        startTime: data.startTime,
        endTime: data.endTime,
        durationMinutes: data.durationMinutes,
        caloriesOverride: data.useManualCalories ? data.caloriesOverride : undefined,
        notes: data.notes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities', ownerId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', ownerId] });
      setIsEditModalOpen(false);
      setSelectedActivity(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (activityId: string) => api.activities.delete(ownerId, activityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities', ownerId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', ownerId] });
      setIsDeleteModalOpen(false);
      setSelectedActivity(null);
    },
  });

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      if (filters.search && !activity.notes?.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.activityType && activity.activityTypeId !== filters.activityType) {
        return false;
      }
      if (filters.dateFrom && activity.activityDate < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && activity.activityDate > filters.dateTo) {
        return false;
      }
      return true;
    });
  }, [activities, filters]);

  const handleEdit = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (activityId: string) => {
    const activity = activities.find((a) => a.activityId === activityId);
    if (activity) {
      setSelectedActivity(activity);
      setIsDeleteModalOpen(true);
    }
  };

  const isLoading = isLoadingTypes || isLoadingActivities;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <Card className="mb-6">
        <CardHeader
          title="Activities"
          subtitle="Track and manage your fitness activities"
          action={
            <Button onClick={() => setIsAddModalOpen(true)}>
              Add Activity
            </Button>
          }
        />
      </Card>

      <ActivityFilters
        activityTypes={activityTypes}
        filters={filters}
        onFilterChange={setFilters}
      />

      <ActivityHistoryList
        activities={filteredActivities}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Activity"
      >
        <ActivityForm
          activityTypes={activityTypes}
          onSubmit={(data) => createMutation.mutate(data)}
          onCancel={() => setIsAddModalOpen(false)}
          isLoading={createMutation.isPending}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedActivity(null);
        }}
        title="Edit Activity"
      >
        {selectedActivity && (
          <ActivityForm
            activityTypes={activityTypes}
            onSubmit={(data) => updateMutation.mutate(data)}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedActivity(null);
            }}
            initialData={{
              activityTypeId: selectedActivity.activityTypeId,
              startTime: format(new Date(selectedActivity.startedAt), "yyyy-MM-dd'T'HH:mm"),
              endTime: format(new Date(selectedActivity.endedAt), "yyyy-MM-dd'T'HH:mm"),
              durationMinutes: selectedActivity.durationMinutes,
              useManualCalories: selectedActivity.calorieSource === 'override',
              caloriesOverride: selectedActivity.caloriesOverride,
              notes: selectedActivity.notes,
            }}
            isLoading={updateMutation.isPending}
          />
        )}
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedActivity(null);
        }}
        title="Delete Activity"
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedActivity(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => selectedActivity && deleteMutation.mutate(selectedActivity.activityId)}
              isLoading={deleteMutation.isPending}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-zinc-700 dark:text-zinc-300">
          Are you sure you want to delete this activity? This action cannot be undone.
        </p>
        {selectedActivity && (
          <div className="mt-4 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
            <p className="font-medium text-zinc-900 dark:text-zinc-50">
              {selectedActivity.activityTypeName}
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              {format(new Date(selectedActivity.activityDate), 'MMM dd, yyyy')} - {selectedActivity.durationMinutes} minutes
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
