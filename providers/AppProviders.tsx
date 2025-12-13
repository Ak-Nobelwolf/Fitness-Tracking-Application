"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import { useOwnerId } from "@/hooks/useOwnerId";
import { useSyncQueue } from "@/hooks/useSyncQueue";
import { registerServiceWorker } from "@/lib/registerServiceWorker";

interface OwnerIdContextType {
  ownerId: string | null;
  isLoading: boolean;
  error: Error | null;
  clearOwnerId: () => void;
}

interface SyncQueueContextType {
  isSyncing: boolean;
  queueCount: number;
  lastSyncError: Error | null;
  syncQueue: () => Promise<void>;
  addToQueue: (method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE", url: string, data?: unknown) => Promise<void>;
  clearQueue: () => Promise<void>;
}

const OwnerIdContext = createContext<OwnerIdContextType | undefined>(undefined);
const SyncQueueContext = createContext<SyncQueueContextType | undefined>(undefined);

export function useOwnerIdContext() {
  const context = useContext(OwnerIdContext);
  if (!context) {
    throw new Error("useOwnerIdContext must be used within AppProviders");
  }
  return context;
}

export function useSyncQueueContext() {
  const context = useContext(SyncQueueContext);
  if (!context) {
    throw new Error("useSyncQueueContext must be used within AppProviders");
  }
  return context;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const ownerIdData = useOwnerId();
  const syncQueueData = useSyncQueue();

  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <OwnerIdContext.Provider value={ownerIdData}>
        <SyncQueueContext.Provider value={syncQueueData}>
          {children}
        </SyncQueueContext.Provider>
      </OwnerIdContext.Provider>
    </QueryClientProvider>
  );
}
