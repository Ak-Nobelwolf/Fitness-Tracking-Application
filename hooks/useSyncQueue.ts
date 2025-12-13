"use client";

import { useEffect, useState, useCallback } from "react";
import { offlineQueue, QueuedRequest } from "@/lib/offlineQueue";
import { apiClient } from "@/lib/apiClient";

const MAX_RETRY_ATTEMPTS = 3;

export function useSyncQueue() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [queueCount, setQueueCount] = useState(0);
  const [lastSyncError, setLastSyncError] = useState<Error | null>(null);

  const updateQueueCount = useCallback(async () => {
    try {
      const count = await offlineQueue.count();
      setQueueCount(count);
    } catch (err) {
      console.error("Failed to get queue count:", err);
    }
  }, []);

  const syncQueue = useCallback(async () => {
    if (isSyncing || !navigator.onLine) {
      return;
    }

    setIsSyncing(true);
    setLastSyncError(null);

    try {
      const requests = await offlineQueue.getAllSorted();
      
      for (const request of requests) {
        try {
          await processRequest(request);
          await offlineQueue.remove(request.id);
        } catch (err) {
          console.error(`Failed to sync request ${request.id}:`, err);
          
          if (request.retries >= MAX_RETRY_ATTEMPTS) {
            console.warn(`Request ${request.id} exceeded max retries, removing from queue`);
            await offlineQueue.remove(request.id);
          } else {
            await offlineQueue.incrementRetries(request.id);
          }
          
          setLastSyncError(err instanceof Error ? err : new Error("Sync failed"));
        }
      }

      await updateQueueCount();
    } catch (err) {
      setLastSyncError(err instanceof Error ? err : new Error("Failed to sync queue"));
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, updateQueueCount]);

  useEffect(() => {
    updateQueueCount();

    const handleOnline = () => {
      syncQueue();
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [syncQueue, updateQueueCount]);

  const addToQueue = useCallback(async (
    method: QueuedRequest["method"],
    url: string,
    data?: unknown
  ) => {
    try {
      await offlineQueue.add({ method, url, data });
      await updateQueueCount();
    } catch (err) {
      console.error("Failed to add request to queue:", err);
      throw err;
    }
  }, [updateQueueCount]);

  const clearQueue = useCallback(async () => {
    try {
      await offlineQueue.clear();
      await updateQueueCount();
    } catch (err) {
      console.error("Failed to clear queue:", err);
      throw err;
    }
  }, [updateQueueCount]);

  return {
    isSyncing,
    queueCount,
    lastSyncError,
    syncQueue,
    addToQueue,
    clearQueue,
  };
}

async function processRequest(request: QueuedRequest): Promise<void> {
  switch (request.method) {
    case "GET":
      await apiClient.get(request.url);
      break;
    case "POST":
      await apiClient.post(request.url, request.data);
      break;
    case "PUT":
      await apiClient.put(request.url, request.data);
      break;
    case "PATCH":
      await apiClient.patch(request.url, request.data);
      break;
    case "DELETE":
      await apiClient.delete(request.url);
      break;
    default:
      throw new Error(`Unsupported method: ${request.method}`);
  }
}
