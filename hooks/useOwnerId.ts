"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";

const OWNER_ID_KEY = "fitness-tracker-owner-id";

export function useOwnerId() {
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function initOwnerId() {
      try {
        let storedOwnerId = localStorage.getItem(OWNER_ID_KEY);

        if (!storedOwnerId) {
          storedOwnerId = crypto.randomUUID();
          localStorage.setItem(OWNER_ID_KEY, storedOwnerId);
        }

        setOwnerId(storedOwnerId);
        apiClient.setOwnerId(storedOwnerId);

        if (navigator.onLine) {
          try {
            await apiClient.post("/api/v1/owners/profile", {
              displayName: "User",
            });
          } catch (err) {
            console.warn("Failed to create owner profile, will retry later:", err);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to initialize owner ID"));
      } finally {
        setIsLoading(false);
      }
    }

    initOwnerId();
  }, []);

  const clearOwnerId = () => {
    localStorage.removeItem(OWNER_ID_KEY);
    setOwnerId(null);
    apiClient.setOwnerId("");
  };

  return {
    ownerId,
    isLoading,
    error,
    clearOwnerId,
  };
}
