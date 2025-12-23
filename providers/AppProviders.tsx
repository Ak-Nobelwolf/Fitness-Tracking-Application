"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import { useOwnerId } from "@/hooks/useOwnerId";
import { useOfflineQueue } from "@/hooks/useOfflineQueue";
import { registerServiceWorker } from "@/lib/registerServiceWorker";

interface OwnerIdContextType {
  ownerId: string | null;
  isLoading: boolean;
  error: Error | null;
  clearOwnerId: () => void;
}

interface OfflineQueueContextType {
  queue: unknown[];
  isOnline: boolean;
  addToQueue: (data: Record<string, unknown>) => string;
  updateStatus: (id: string, status: 'pending' | 'processing' | 'completed' | 'failed', error?: string) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
  getPendingCount: () => number;
}

const OwnerIdContext = createContext<OwnerIdContextType | undefined>(undefined);
const OfflineQueueContext = createContext<OfflineQueueContextType | undefined>(undefined);

export function useOwnerIdContext() {
  const context = useContext(OwnerIdContext);
  if (!context) {
    throw new Error("useOwnerIdContext must be used within AppProviders");
  }
  return context;
}

export function useOfflineQueueContext() {
  const context = useContext(OfflineQueueContext);
  if (!context) {
    throw new Error("useOfflineQueueContext must be used within AppProviders");
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
  const offlineQueueData = useOfflineQueue();

  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <OwnerIdContext.Provider value={ownerIdData}>
        <OfflineQueueContext.Provider value={offlineQueueData}>
          {children}
        </OfflineQueueContext.Provider>
      </OwnerIdContext.Provider>
    </QueryClientProvider>
  );
}
