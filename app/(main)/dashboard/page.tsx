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
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Track your fitness activities and monitor your progress
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border-2 border-primary/20 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary text-sm">🆔</span>
              </div>
              <span className="text-sm font-semibold text-primary">Owner ID</span>
            </div>
            <span className="text-xl font-bold text-foreground truncate" title={ownerId || ""}>
              {ownerId ? `${ownerId.substring(0, 8)}...` : "N/A"}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-2xl border-2 border-success/20 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
                <span className="text-success text-sm">{isOnline ? "🟢" : "🔴"}</span>
              </div>
              <span className="text-sm font-semibold text-success">Sync Status</span>
            </div>
            <span className="text-xl font-bold text-foreground">
              {isOnline ? "🟢 Online" : "🔴 Offline"}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-warning/10 to-warning/5 rounded-2xl border-2 border-warning/20 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-warning/20 flex items-center justify-center">
                <span className="text-warning text-sm">⏳</span>
              </div>
              <span className="text-sm font-semibold text-warning">Pending Sync</span>
            </div>
            <span className="text-xl font-bold text-foreground">{queueCount}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl border-2 border-secondary/20 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center">
                <span className="text-secondary text-sm">{navigator.onLine ? "📡" : "📵"}</span>
              </div>
              <span className="text-sm font-semibold text-secondary">Connection</span>
            </div>
            <span className="text-xl font-bold text-foreground">
              {navigator.onLine ? "📡 Connected" : "📵 Disconnected"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-gradient-to-br from-white to-white/50 dark:from-zinc-900 dark:to-zinc-900/50 rounded-2xl border-2 border-primary/10 p-8 shadow-xl">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
            📈 Your Fitness Journey
          </h2>
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-8 border-2 border-dashed border-primary/20 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-muted-foreground text-lg mb-4">
              Your recent activities will appear here once you start tracking.
            </p>
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 border border-primary/20">
              <p className="text-sm text-foreground font-medium">
                💡 <span className="text-primary">Pro tip:</span> Start by adding your first activity to see your progress charts!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
