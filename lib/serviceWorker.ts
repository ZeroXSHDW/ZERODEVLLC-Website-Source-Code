// Service Worker registration utilities
import { useCallback, useRef } from "react";

export interface ServiceWorkerConfig {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

export class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private config: ServiceWorkerConfig;

  constructor(config: ServiceWorkerConfig = {}) {
    this.config = config;
  }

  setConfig(config: ServiceWorkerConfig): void {
    this.config = config;
  }

  async register(): Promise<void> {
    if (!("serviceWorker" in navigator) || this.registration) return;

    try {
      const registration =
        (await navigator.serviceWorker.getRegistration("/")) ||
        (await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        }));

      this.registration = registration;

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
              this.config.onUpdate?.(registration);
            }
          });
        }
      });

      // Handle controller change (new SW activated)
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        console.log("Service worker updated, refreshing page...");
        window.location.reload();
      });

      // Handle messages from service worker
      navigator.serviceWorker.addEventListener("message", (event) => {
        const { type, data } = event.data || {};
        console.log("[SW Message]", type, data);
      });

      console.log(
        "Service worker registered successfully:",
        registration.scope,
      );
      this.config.onSuccess?.(registration);
    } catch (error) {
      console.error("Service worker registration failed:", error);
      this.config.onError?.(error as Error);
    }
  }

  async unregister(): Promise<void> {
    if (this.registration) {
      await this.registration.unregister();
      this.registration = null;
      console.log("Service worker unregistered");
    }
  }

  async update(): Promise<void> {
    if (this.registration) {
      await this.registration.update();
      console.log("Service worker update triggered");
    }
  }

  async getVersion(): Promise<string | null> {
    return new Promise((resolve) => {
      if (!navigator.serviceWorker.controller) {
        resolve(null);
        return;
      }

      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data?.version || null);
      };

      navigator.serviceWorker.controller.postMessage({ type: "GET_VERSION" }, [
        messageChannel.port2,
      ]);

      // Timeout after 5 seconds
      setTimeout(() => resolve(null), 5000);
    });
  }

  async clearCache(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!navigator.serviceWorker.controller) {
        resolve(false);
        return;
      }

      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data?.success || false);
      };

      navigator.serviceWorker.controller.postMessage({ type: "CLEAR_CACHE" }, [
        messageChannel.port2,
      ]);

      // Timeout after 10 seconds
      setTimeout(() => resolve(false), 10000);
    });
  }

  get isRegistered(): boolean {
    return !!this.registration;
  }

  get isControlled(): boolean {
    return !!navigator.serviceWorker?.controller;
  }
}

// React hook for service worker management
export function useServiceWorker(config: ServiceWorkerConfig = {}) {
  const managerRef = useRef<ServiceWorkerManager | null>(null);
  if (!managerRef.current) {
    managerRef.current = new ServiceWorkerManager(config);
  } else {
    managerRef.current.setConfig(config);
  }
  const manager = managerRef.current;

  const register = useCallback(async () => {
    await manager.register();
  }, [manager]);

  const unregister = useCallback(async () => {
    await manager.unregister();
  }, [manager]);

  const update = useCallback(async () => {
    await manager.update();
  }, [manager]);

  const getVersion = useCallback(async () => {
    return await manager.getVersion();
  }, [manager]);

  const clearCache = useCallback(async () => {
    return await manager.clearCache();
  }, [manager]);

  return {
    register,
    unregister,
    update,
    getVersion,
    clearCache,
    isRegistered: manager.isRegistered,
    isControlled: manager.isControlled,
  };
}
