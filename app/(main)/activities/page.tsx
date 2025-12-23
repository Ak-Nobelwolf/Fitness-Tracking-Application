"use client";

import { useState } from "react";
import { useOwnerIdContext } from "@/providers/AppProviders";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ActivityForm } from "@/components/activities/ActivityForm";
import { Modal } from "@/components/ui/Modal";
import { ActivityHistoryList } from "@/components/activities/ActivityHistoryList";
import { ActivityFormData } from "@/lib/validation";

export default function ActivitiesPage() {
  const { isLoading, ownerId } = useOwnerIdContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: activities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ["activities"],
    queryFn: () => api.activities.list(ownerId!),
    enabled: !!ownerId,
  });

  const { data: activityTypes = [], isLoading: typesLoading } = useQuery({
    queryKey: ["activityTypes"],
    queryFn: () => api.activityTypes.list(ownerId!),
    enabled: !!ownerId,
  });

  const createActivityMutation = useMutation({
    mutationFn: (data: ActivityFormData) => api.activities.create(ownerId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      setIsModalOpen(false);
    },
  });

  const handleAddActivity = (data: ActivityFormData) => {
    createActivityMutation.mutate(data);
  };

  if (isLoading || activitiesLoading || typesLoading) {
    return (
      <div className="container mx-auto max-w-screen-2xl px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4 text-muted-foreground">Loading your fitness data...</p>
          </div>
        </div>
      </div>
    );
  }

  const hasActivities = activities.length > 0;

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Activities
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Track and manage your fitness journey
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center rounded-xl bg-gradient-to-r from-primary to-primary/80 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <svg
            className="-ml-0.5 mr-2 h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          New Activity
        </button>
      </div>

      {!hasActivities ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-gradient-to-br from-primary/5 to-secondary/5 p-12">
          <div className="text-center">
            <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <svg
                className="h-10 w-10 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="mt-6 text-2xl font-bold text-foreground">No activities yet</h3>
            <p className="mt-3 text-lg text-muted-foreground max-w-md mx-auto">
              Start tracking your fitness journey by logging your first activity. Every step counts!
            </p>
            <div className="mt-8">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center rounded-xl bg-gradient-to-r from-primary to-secondary px-8 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <svg
                  className="-ml-0.5 mr-2 h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
                Create Your First Activity
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <ActivityHistoryList activities={activities} />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Activity"
      >
        <ActivityForm
          activityTypes={activityTypes}
          onSubmit={handleAddActivity}
          onCancel={() => setIsModalOpen(false)}
          isLoading={createActivityMutation.isPending}
        />
      </Modal>
    </div>
  );
}
