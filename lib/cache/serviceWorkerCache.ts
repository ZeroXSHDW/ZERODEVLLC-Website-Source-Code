// Service Worker for advanced caching strategies
// This provides offline capabilities and faster loading

import { log } from '@/lib/utils/logger';

const STATIC_CACHE = '3d-viewer-static-v1';
const MODEL_CACHE = '3d-viewer-models-v1';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

interface CacheEntry {
  url: string;
  timestamp: number;
  size: number;
  type: 'model' | 'texture' | 'static' | 'api';
}

export class ServiceWorkerCache {
  private static instance: ServiceWorkerCache;
  private cache: Map<string, CacheEntry> = new Map();

  static getInstance(): ServiceWorkerCache {
    if (!ServiceWorkerCache.instance) {
      ServiceWorkerCache.instance = new ServiceWorkerCache();
    }
    return ServiceWorkerCache.instance;
  }

  // Register service worker
  async register(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        log.debug('Service Worker registered:', registration.scope);

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available
                this.notifyUserOfUpdate();
              }
            });
          }
        });

        // Handle messages from service worker
        navigator.serviceWorker.addEventListener('message', this.handleMessage.bind(this));

      } catch (error) {
        log.error('Service Worker registration failed:', error);
      }
    }
  }

  private notifyUserOfUpdate(): void {
    // Show update notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('3D Viewer Update Available', {
        body: 'A new version is available. Refresh to update.',
        icon: '/icon-192x192.png',
      });
    }
  }

  private handleMessage(event: MessageEvent): void {
    const { type, data } = event.data;

    switch (type) {
      case 'CACHE_HIT':
        log.debug('Cache hit for:', data.url);
        break;
      case 'CACHE_MISS':
        log.debug('Cache miss for:', data.url);
        break;
      case 'BACKGROUND_SYNC':
        this.handleBackgroundSync(data);
        break;
    }
  }

  private async handleBackgroundSync(data: { url: string; options: RequestInit }): Promise<void> {
    // Retry failed requests
    try {
      await fetch(data.url, data.options);
      log.info('Background sync successful for:', data.url);
    } catch (error) {
      log.error('Background sync failed:', error);
    }
  }

  // Cache management
  async openCache(name: string): Promise<Cache> {
    return await caches.open(name);
  }

  async cacheStaticAssets(): Promise<void> {
    try {
      const cache = await this.openCache(STATIC_CACHE);
      await cache.addAll(STATIC_ASSETS);
      log.debug('Static assets cached');
    } catch (error) {
      log.error('Failed to cache static assets:', error);
    }
  }

  async cacheModel(url: string, response: Response): Promise<void> {
    try {
      const cache = await this.openCache(MODEL_CACHE);
      await cache.put(url, response);

      // Track cache entry
      const entry: CacheEntry = {
        url,
        timestamp: Date.now(),
        size: 0, // Would need to calculate actual size
        type: 'model',
      };
      this.cache.set(url, entry);

      log.debug('Model cached:', url);
    } catch (error) {
      log.error('Failed to cache model:', error);
    }
  }

  async getCachedModel(url: string): Promise<Response | null> {
    try {
      const cache = await this.openCache(MODEL_CACHE);
      const response = await cache.match(url);
      return response || null;
    } catch (error) {
      log.error('Failed to get cached model:', error);
      return null;
    }
  }

  // Intelligent caching based on usage patterns
  async prefetchResources(urls: string[]): Promise<void> {
    const cachePromises = urls.map(async (url) => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const cache = await this.openCache(MODEL_CACHE);
          await cache.put(url, response);
        }
      } catch (error) {
        log.warn('Failed to prefetch:', url, error);
      }
    });

    await Promise.allSettled(cachePromises);
  }

  // Cache cleanup based on LRU and size limits
  async cleanupCache(maxSize: number = 100 * 1024 * 1024): Promise<void> {
    try {
      const cacheNames = await caches.keys();
      let totalSize = 0;

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();

        // Sort by access time (would need to track this)
        const entries = await Promise.all(
          keys.map(async (request) => {
            const response = await cache.match(request);
            return {
              request,
              response,
              size: 0, // Would need to estimate size
            };
          })
        );

        // Remove oldest entries if over limit
        for (const entry of entries.reverse()) {
          if (totalSize > maxSize) {
            await cache.delete(entry.request);
            totalSize -= entry.size;
          } else {
            totalSize += entry.size;
          }
        }
      }

      log.info('Cache cleanup completed');
    } catch (error) {
      log.error('Cache cleanup failed:', error);
    }
  }

  // Background sync for offline requests
  async queueRequest(url: string, options: RequestInit): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if ('sync' in registration) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (registration as any).sync.register('background-sync');
          // Store request data for background sync
          localStorage.setItem(`queued-request-${Date.now()}`, JSON.stringify({ url, options }));
        }
      } catch (error) {
        log.error('Background sync registration failed:', error);
      }
    }
  }

  // Check online status and handle accordingly
  isOnline(): boolean {
    return navigator.onLine;
  }

  // Get cache statistics
  async getCacheStats(): Promise<{
    staticCache: number;
    modelCache: number;
    textureCache: number;
    total: number;
  }> {
    const stats = {
      staticCache: 0,
      modelCache: 0,
      textureCache: 0,
      total: 0,
    };

    try {
      const cacheNames = await caches.keys();

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();

        if (cacheName.includes('static')) {
          stats.staticCache += keys.length;
        } else if (cacheName.includes('model')) {
          stats.modelCache += keys.length;
        } else if (cacheName.includes('texture')) {
          stats.textureCache += keys.length;
        }

        stats.total += keys.length;
      }
    } catch (error) {
      log.error('Failed to get cache stats:', error);
    }

    return stats;
  }

  // Clear all caches
  async clearAllCaches(): Promise<void> {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      this.cache.clear();
      log.info('All caches cleared');
    } catch (error) {
      log.error('Failed to clear caches:', error);
    }
  }
}

// Service Worker message utilities
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendMessageToSW = async (message: any): Promise<void> => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(message);
  }
};

export const requestCacheStats = async (): Promise<void> => {
  await sendMessageToSW({ type: 'GET_CACHE_STATS' });
};

export const requestCacheCleanup = async (): Promise<void> => {
  await sendMessageToSW({ type: 'CLEANUP_CACHE' });
};

// Export singleton instance
export const swCache = ServiceWorkerCache.getInstance();
