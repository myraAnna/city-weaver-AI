'use client';

import { AppProvider } from '@/contexts/app-context';

export interface ClientProvidersProps {
  children: React.ReactNode;
}

export const ClientProviders = ({ children }: ClientProvidersProps) => {
  return (
    <AppProvider>
      {children}
    </AppProvider>
  );
};