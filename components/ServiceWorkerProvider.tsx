"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useServiceWorker } from '@/lib/serviceWorker';
import { toast } from 'sonner';
import { log } from '@/lib/utils/logger';

interface ServiceWorkerContextType {
  isRegistered: boolean;
  isControlled: boolean;
  version: string | null;
  updateAvailable: boolean;
  updateServiceWorker: () => void;
  clearCache: () => Promise<boolean>;
}

const ServiceWorkerContext = createContext<ServiceWorkerContextType | null>(null);

export function useServiceWorkerContext() {
  const context = useContext(ServiceWorkerContext);
  if (!context) {
    throw new Error('useServiceWorkerContext must be used within ServiceWorkerProvider');
  }
  return context;
}

interface ServiceWorkerProviderProps {
  children: ReactNode;
}

export function ServiceWorkerProvider({ children }: ServiceWorkerProviderProps) {
  const [version, setVersion] = useState<string | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const { register, update, getVersion, clearCache, isRegistered, isControlled } = useServiceWorker({
    onUpdate: (registration) => {
      log.info('Service worker update available');
      setUpdateAvailable(true);
      toast.info('Update Available', {
        description: 'A new version is available. Refresh to update.',
        action: {
          label: 'Update',
          onClick: () => {
            registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
          },
        },
        duration: 10000,
      });
    },
    onSuccess: async () => {
      log.info('Service worker registered successfully');
      const swVersion = await getVersion();
      setVersion(swVersion);
    },
    onError: (error) => {
      log.error('Service worker registration failed:', error);
      toast.error('Service Worker Error', {
        description: 'Failed to register service worker for offline functionality.',
      });
    },
  });

  const updateServiceWorker = async () => {
    await update();
    setUpdateAvailable(false);
  };

  const handleClearCache = async () => {
    const success = await clearCache();
    if (success) {
      toast.success('Cache Cleared', {
        description: 'Application cache has been cleared.',
      });
    } else {
      toast.error('Cache Clear Failed', {
        description: 'Failed to clear application cache.',
      });
    }
    return success;
  };

  useEffect(() => {
    // Only register service worker in production and when not in development
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      register();
    }

    // Get version on mount
    getVersion().then(setVersion);
  }, [register, getVersion]);

  const contextValue: ServiceWorkerContextType = {
    isRegistered,
    isControlled,
    version,
    updateAvailable,
    updateServiceWorker,
    clearCache: handleClearCache,
  };

  return (
    <ServiceWorkerContext.Provider value={contextValue}>
      {children}
    </ServiceWorkerContext.Provider>
  );
}
