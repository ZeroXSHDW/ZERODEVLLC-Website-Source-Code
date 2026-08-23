// Client-side helpers for the public asset/model service-worker cache.
// Sensitive, authenticated, API, and arbitrary-origin requests are never
// persisted here.

import { log } from "@/lib/utils/logger";

const CACHE_PREFIX = "zerodevllc-sw-";
const STATIC_CACHE = `${CACHE_PREFIX}static-v2`;
const MODEL_CACHE = `${CACHE_PREFIX}models-v2`;
const OWNED_CACHE_NAMES = new Set([STATIC_CACHE, MODEL_CACHE]);

const STATIC_ASSETS = [
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-192x192.svg",
  "/robots.txt",
];

const MODEL_PATH = /\.(glb|gltf)$/i;

function getSameOriginUrl(value: string): URL | null {
  if (typeof window === "undefined") return null;

  try {
    const url = new URL(value, window.location.origin);
    if (
      url.origin !== window.location.origin ||
      !["http:", "https:"].includes(url.protocol)
    ) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

function isPublicModelUrl(value: string): boolean {
  const url = getSameOriginUrl(value);
  return Boolean(
    url && MODEL_PATH.test(url.pathname) && !url.search && !url.hash,
  );
}

function isCacheableModelResponse(response: Response): boolean {
  if (
    !response.ok ||
    response.type !== "basic" ||
    response.redirected ||
    response.headers.has("set-cookie")
  ) {
    return false;
  }

  const cacheControl = response.headers.get("cache-control") || "";
  const contentType = response.headers.get("content-type") || "";
  return (
    !/\bno-store\b/i.test(cacheControl) &&
    /model\/gltf|application\/octet-stream|application\/json/i.test(contentType)
  );
}

interface CacheEntry {
  url: string;
  timestamp: number;
  size: number;
  type: "model" | "texture" | "static" | "api";
}

export class ServiceWorkerCache {
  private static instance: ServiceWorkerCache;
  private registration: ServiceWorkerRegistration | null = null;
  private cache: Map<string, CacheEntry> = new Map();

  static getInstance(): ServiceWorkerCache {
    if (!ServiceWorkerCache.instance) {
      ServiceWorkerCache.instance = new ServiceWorkerCache();
    }
    return ServiceWorkerCache.instance;
  }

  // Register service worker
  async register(): Promise<void> {
    if (!("serviceWorker" in navigator) || this.registration) return;

    try {
      const registration =
        (await navigator.serviceWorker.getRegistration("/")) ||
        (await navigator.serviceWorker.register("/sw.js", { scope: "/" }));
      this.registration = registration;
      log.debug("Service Worker registered:", registration.scope);

      // Handle updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New version available
              this.notifyUserOfUpdate();
            }
          });
        }
      });

      // Handle messages from service worker
      navigator.serviceWorker.addEventListener(
        "message",
        this.handleMessage.bind(this),
      );
    } catch (error) {
      log.error("Service Worker registration failed:", error);
    }
  }

  private notifyUserOfUpdate(): void {
    // Show update notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("3D Viewer Update Available", {
        body: "A new version is available. Refresh to update.",
        icon: "/icon-192x192.png",
      });
    }
  }

  private handleMessage(event: MessageEvent): void {
    const message = event.data;
    if (!message || typeof message !== "object") return;

    const { type, data } = message as {
      type?: string;
      data?: { url?: unknown };
    };

    switch (type) {
      case "CACHE_HIT":
        if (typeof data?.url === "string") log.debug("Cache hit");
        break;
      case "CACHE_MISS":
        if (typeof data?.url === "string") log.debug("Cache miss");
        break;
    }
  }

  // Cache management
  async openCache(name: string): Promise<Cache> {
    if (!OWNED_CACHE_NAMES.has(name)) {
      throw new Error("Refusing to open an unmanaged cache");
    }
    return await caches.open(name);
  }

  async cacheStaticAssets(): Promise<void> {
    try {
      const cache = await this.openCache(STATIC_CACHE);
      await Promise.allSettled(STATIC_ASSETS.map((asset) => cache.add(asset)));
      log.debug("Static assets cached");
    } catch (error) {
      log.error("Failed to cache static assets:", error);
    }
  }

  async cacheModel(url: string, response: Response): Promise<void> {
    if (!isPublicModelUrl(url) || !isCacheableModelResponse(response)) {
      log.warn("Refused to cache a non-public model response");
      return;
    }

    try {
      const cache = await this.openCache(MODEL_CACHE);
      await cache.put(url, response.clone());

      // Track cache entry
      const entry: CacheEntry = {
        url,
        timestamp: Date.now(),
        size: 0, // Would need to calculate actual size
        type: "model",
      };
      this.cache.set(url, entry);

      log.debug("Model cached:", url);
    } catch (error) {
      log.error("Failed to cache model:", error);
    }
  }

  async getCachedModel(url: string): Promise<Response | null> {
    if (!isPublicModelUrl(url)) return null;

    try {
      const cache = await this.openCache(MODEL_CACHE);
      const response = await cache.match(url);
      return response || null;
    } catch (error) {
      log.error("Failed to get cached model:", error);
      return null;
    }
  }

  // Intelligent caching based on usage patterns
  async prefetchResources(urls: string[]): Promise<void> {
    const cachePromises = urls.filter(isPublicModelUrl).map(async (url) => {
      try {
        const response = await fetch(url, {
          cache: "no-store",
          credentials: "omit",
        });
        if (isCacheableModelResponse(response)) {
          const cache = await this.openCache(MODEL_CACHE);
          await cache.put(url, response.clone());
        }
      } catch (error) {
        log.warn("Failed to prefetch:", url, error);
      }
    });

    await Promise.allSettled(cachePromises);
  }

  // Cache cleanup based on LRU and size limits
  async cleanupCache(maxSize: number = 100 * 1024 * 1024): Promise<void> {
    try {
      let totalSize = 0;

      for (const cacheName of OWNED_CACHE_NAMES) {
        const cache = await this.openCache(cacheName);
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
          }),
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

      log.info("Cache cleanup completed");
    } catch (error) {
      log.error("Cache cleanup failed:", error);
    }
  }

  // Offline request queues are intentionally disabled. Persisting arbitrary
  // RequestInit objects can expose authorization headers or request bodies.
  async queueRequest(url: string, options: RequestInit): Promise<void> {
    void url;
    void options;
    log.warn(
      "Offline request queue is disabled; request data is never persisted in browser storage",
    );
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
      for (const cacheName of OWNED_CACHE_NAMES) {
        const cache = await this.openCache(cacheName);
        const keys = await cache.keys();

        if (cacheName.includes("static")) {
          stats.staticCache += keys.length;
        } else if (cacheName.includes("model")) {
          stats.modelCache += keys.length;
        } else if (cacheName.includes("texture")) {
          stats.textureCache += keys.length;
        }

        stats.total += keys.length;
      }
    } catch (error) {
      log.error("Failed to get cache stats:", error);
    }

    return stats;
  }

  // Clear all caches
  async clearAllCaches(): Promise<void> {
    try {
      const cacheNames = Array.from(OWNED_CACHE_NAMES);
      await Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName)),
      );
      this.cache.clear();
      log.info("All caches cleared");
    } catch (error) {
      log.error("Failed to clear caches:", error);
    }
  }
}

// Service Worker message utilities

export const sendMessageToSW = async (
  message: Record<string, unknown>,
): Promise<void> => {
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(message);
  }
};

export const requestCacheStats = async (): Promise<void> => {
  await sendMessageToSW({ type: "GET_CACHE_STATS" });
};

export const requestCacheCleanup = async (): Promise<void> => {
  await sendMessageToSW({ type: "CLEANUP_CACHE" });
};

// Export singleton instance
export const swCache = ServiceWorkerCache.getInstance();
