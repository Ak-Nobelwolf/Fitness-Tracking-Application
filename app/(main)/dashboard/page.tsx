"use client";

import { useOwnerIdContext, useOfflineQueueContext } from "@/providers/AppProviders";

export default function DashboardPage() {
  const { ownerId, isLoading } = useOwnerIdContext();
  const { isOnline, getPendingCount } = useOfflineQueueContext();
  const queueCount = getPendingCount();

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-screen-2xl px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Track your fitness activities and monitor your progress
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">Owner ID</span>
            <span className="text-2xl font-bold mt-2 truncate" title={ownerId || ""}>
              {ownerId ? `${ownerId.substring(0, 8)}...` : "N/A"}
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">Sync Status</span>
            <span className="text-2xl font-bold mt-2">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">Pending Sync</span>
            <span className="text-2xl font-bold mt-2">{queueCount}</span>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">Connection</span>
            <span className="text-2xl font-bold mt-2">
              {navigator.onLine ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          <p className="text-muted-foreground">
            Your recent activities will appear here once you start tracking.
          </p>
        </div>
      </div>
    </div>
  );
}
