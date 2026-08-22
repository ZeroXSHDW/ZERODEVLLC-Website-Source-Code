import { lazy } from "react";

// Route-based code splitting (for future use)
// export const routes = {
//   home: () => import('../app/page'),
//   notFound: () => import('../app/not-found'),
// };

// Feature-based code splitting
export const features = {
  // Core 3D features
  threeCore: () => import("three"),
  drei: () => import("@react-three/drei"),
  fiber: () => import("@react-three/fiber"),

  // Advanced features loaded on demand
  xr: () => import("@react-three/xr"),
  postprocessing: () => import("@react-three/postprocessing"),

  // UI libraries loaded progressively
  framerMotion: () => import("framer-motion"),
  lucideIcons: () => import("lucide-react"),
  sonner: () => import("sonner"),

  // Utilities
  dracoLoader: () => import("three/examples/jsm/loaders/DRACOLoader.js"),
  gltfLoader: () => import("three/examples/jsm/loaders/GLTFLoader.js"),
};

// Dynamic component loader with error boundaries
// Note: JSX removed to keep this as a .ts file
export function createLazyComponent<T extends React.ComponentType<unknown>>(
  importFunc: () => Promise<{ default: T }>,
) {
  return lazy(importFunc);
}

// Smart loading strategy based on device capabilities
export const loadStrategy = {
  // Load immediately on fast devices
  immediate: async (imports: (() => Promise<unknown>)[]) => {
    return Promise.all(imports.map((imp) => imp()));
  },

  // Load with priority queue
  prioritized: async (
    imports: { import: () => Promise<unknown>; priority: number }[],
  ) => {
    const sortedImports = imports.sort((a, b) => a.priority - b.priority);
    const results = [];

    for (const item of sortedImports) {
      try {
        const result = await item.import();
        results.push(result);
      } catch (error) {
        console.warn("Failed to load prioritized import:", error);
      }
    }

    return results;
  },

  // Load on user interaction
  onInteraction: (imports: (() => Promise<unknown>)[]) => {
    const loadOnInteraction = () => {
      imports.forEach((imp) =>
        imp().catch(() => {
          // Failed to load on interaction - continue silently
        }),
      );
    };

    const events = ["mousedown", "touchstart", "keydown", "scroll"];
    events.forEach((event) => {
      document.addEventListener(event, loadOnInteraction, { once: true });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, loadOnInteraction);
      });
    };
  },

  // Load based on network conditions
  networkAware: async (imports: (() => Promise<unknown>)[]) => {
    if ("connection" in navigator) {
      const connection = (
        navigator as unknown as {
          connection: { effectiveType: string; downlink: number };
        }
      ).connection;
      const isSlowConnection =
        connection.effectiveType === "slow-2g" ||
        connection.effectiveType === "2g" ||
        connection.downlink < 1;

      if (isSlowConnection) {
        // Load sequentially on slow connections
        const results = [];
        for (const imp of imports) {
          try {
            const result = await imp();
            results.push(result);
          } catch (error) {
            console.warn("Failed to load import on slow connection:", error);
          }
        }
        return results;
      }
    }

    // Load in parallel on fast connections
    return Promise.allSettled(imports.map((imp) => imp()));
  },
};

// Automatic bundle splitting based on route and user behavior
export const setupAutomaticSplitting = () => {
  // Detect device capabilities
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  const hasTouch = "ontouchstart" in window;

  // Load appropriate bundles based on device
  if (isMobile || hasTouch) {
    // Preload mobile-specific features
    setTimeout(() => {
      features.fiber().catch(console.warn);
    }, 100);
  } else {
    // Preload desktop-specific features
    setTimeout(() => {
      features.drei().catch(console.warn);
    }, 100);
  }

  // Preload critical features after initial load
  setTimeout(() => {
    features.threeCore().catch(console.warn);
  }, 500);

  // Preload advanced features on user engagement
  const handleEngagement = () => {
    setTimeout(() => {
      features.xr().catch(console.warn);
      features.postprocessing().catch(console.warn);
    }, 2000);
  };

  const engagementEvents = ["click", "touchstart", "keydown", "scroll"];
  engagementEvents.forEach((event) => {
    document.addEventListener(event, handleEngagement, { once: true });
  });

  return () => {
    engagementEvents.forEach((event) => {
      document.removeEventListener(event, handleEngagement);
    });
  };
};

// Performance-aware loading
export const createPerformanceAwareLoader = <T>(
  loadFunction: () => Promise<T>,
  options: {
    timeout?: number;
    retries?: number;
    fallback?: T;
  } = {},
) => {
  const { timeout = 10000, retries = 2, fallback } = options;

  return async (): Promise<T> => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const result = await Promise.race([
          loadFunction(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Load timeout")), timeout),
          ),
        ]);
        return result;
      } catch (error) {
        console.warn(`Load attempt ${attempt + 1} failed:`, error);
        if (attempt === retries) {
          if (fallback !== undefined) {
            console.warn("Using fallback value");
            return fallback;
          }
          throw error;
        }
        // Exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000),
        );
      }
    }
    throw new Error("All load attempts failed");
  };
};
