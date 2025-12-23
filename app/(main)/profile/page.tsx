"use client";

import { useOwnerIdContext } from "@/providers/AppProviders";

export default function ProfilePage() {
  const { ownerId, isLoading, clearOwnerId } = useOwnerIdContext();

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-screen-2xl px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4 text-muted-foreground">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Profile
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Manage your profile and preferences
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border-2 border-primary/20 p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white text-xl">👤</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground">User Information</h2>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white/50 rounded-xl p-4 border border-primary/20">
              <label className="text-sm font-semibold text-primary block mb-2">
                🆔 Owner ID
              </label>
              <p className="text-sm font-mono break-all text-foreground bg-primary/5 px-3 py-2 rounded-lg">{ownerId}</p>
            </div>

            <div className="bg-white/50 rounded-xl p-4 border border-primary/20">
              <label className="text-sm font-semibold text-primary block mb-2">
                👤 Display Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full rounded-xl border-2 border-primary/20 bg-white/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div className="bg-white/50 rounded-xl p-4 border border-primary/20">
              <label className="text-sm font-semibold text-primary block mb-2">
                ⚖️ Weight (kg)
              </label>
              <input
                type="number"
                placeholder="70"
                className="w-full rounded-xl border-2 border-primary/20 bg-white/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div className="bg-white/50 rounded-xl p-4 border border-primary/20">
              <label className="text-sm font-semibold text-primary block mb-2">
                📏 Height (cm)
              </label>
              <input
                type="number"
                placeholder="175"
                className="w-full rounded-xl border-2 border-primary/20 bg-white/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <button
              type="button"
              className="w-full bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              💾 Save Changes
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-2xl border-2 border-secondary/20 p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                <span className="text-white text-xl">⚙️</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">Settings</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white/50 rounded-xl p-4 border border-secondary/20">
                <h3 className="text-sm font-semibold text-secondary mb-3 flex items-center gap-2">
                  📱 Offline Mode
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your activities will be saved locally and synced when you&apos;re back online.
                </p>
                <div className="bg-gradient-to-r from-success/10 to-success/5 rounded-xl p-4 border border-success/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-success">Status</span>
                    <span className={`text-sm font-bold flex items-center gap-2 ${navigator.onLine ? "text-success" : "text-warning"}`}>
                      {navigator.onLine ? "🟢 Online" : "🔴 Offline"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-error/5 to-error/10 rounded-2xl border-2 border-error/20 p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-error to-warning flex items-center justify-center">
                <span className="text-white text-xl">⚠️</span>
              </div>
              <h2 className="text-2xl font-bold text-error">Danger Zone</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Clear your local data and start fresh. This cannot be undone.
              </p>
              <button
                type="button"
                onClick={clearOwnerId}
                className="w-full bg-gradient-to-r from-error to-error/80 text-white rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                🗑️ Clear Local Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
