"use client";

import { useOwnerIdContext } from "@/providers/AppProviders";

export default function ProfilePage() {
  const { ownerId, isLoading, clearOwnerId } = useOwnerIdContext();

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
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your profile and preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Owner ID
              </label>
              <p className="mt-1 text-sm font-mono break-all">{ownerId}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Display Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Weight (kg)
              </label>
              <input
                type="number"
                placeholder="70"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Height (cm)
              </label>
              <input
                type="number"
                placeholder="175"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <button
              type="button"
              className="w-full rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Settings</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Offline Mode</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Your activities will be saved locally and synced when you&apos;re back online.
              </p>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <span className="text-sm">Status</span>
                <span className={`text-sm font-medium ${navigator.onLine ? "text-success" : "text-warning"}`}>
                  {navigator.onLine ? "Online" : "Offline"}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h3 className="text-sm font-medium mb-2 text-error">Danger Zone</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Clear your local data and start fresh. This cannot be undone.
              </p>
              <button
                type="button"
                onClick={clearOwnerId}
                className="w-full rounded-md bg-error px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-error/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
              >
                Clear Local Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
