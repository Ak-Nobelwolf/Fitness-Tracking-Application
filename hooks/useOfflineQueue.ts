import { useState, useEffect, useCallback } from 'react';
import { OfflineActivity } from '@/lib/types';

const QUEUE_KEY = 'fitness-offline-queue';

export function useOfflineQueue() {
  const [queue, setQueue] = useState<OfflineActivity[]>(() => {
    if (typeof window === 'undefined') return [];
    const savedQueue = localStorage.getItem(QUEUE_KEY);
    return savedQueue ? JSON.parse(savedQueue) : [];
  });
  
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof window === 'undefined') return true;
    return navigator.onLine;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }, [queue]);

  const addToQueue = useCallback((data: Record<string, unknown>) => {
    const item: OfflineActivity = {
      id: crypto.randomUUID(),
      data,
      status: 'pending',
      timestamp: Date.now(),
    };
    setQueue(prev => [...prev, item]);
    return item.id;
  }, []);

  const updateStatus = useCallback((id: string, status: OfflineActivity['status'], error?: string) => {
    setQueue(prev => prev.map(item => 
      item.id === id ? { ...item, status, error } : item
    ));
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const getPendingCount = useCallback(() => {
    return queue.filter(item => item.status === 'pending').length;
  }, [queue]);

  return {
    queue,
    isOnline,
    addToQueue,
    updateStatus,
    removeFromQueue,
    clearQueue,
    getPendingCount,
  };
}
