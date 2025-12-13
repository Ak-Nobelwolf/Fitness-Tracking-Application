'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState, createContext, useContext } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

interface OwnerContextType {
  ownerId: string;
  setOwnerId: (id: string) => void;
}

const OwnerContext = createContext<OwnerContextType | undefined>(undefined);

export function useOwnerId() {
  const context = useContext(OwnerContext);
  if (!context) {
    throw new Error('useOwnerId must be used within Providers');
  }
  return context;
}

export function Providers({ children }: { children: ReactNode }) {
  const [ownerId, setOwnerId] = useState('default-owner-id');

  return (
    <OwnerContext.Provider value={{ ownerId, setOwnerId }}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </OwnerContext.Provider>
  );
}
