/**
 * Hook for prefetching resources
 * Preloads models and assets before they're needed
 */

import { useEffect, useRef } from "react";

interface PrefetchOptions {
  enabled?: boolean;
  priority?: "high" | "low";
}

/**
 * Prefetch a resource (model, texture, etc.)
 */
export function usePrefetch(
  url: string | null,
  options: PrefetchOptions = {},
): void {
  const { enabled = true, priority = "low" } = options;
  const prefetchedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled || !url || prefetchedRef.current.has(url)) return;

    // Use link prefetch for low priority, fetch for high priority
    if (priority === "high" && "fetch" in window) {
      fetch(url, { method: "HEAD" }).catch(() => {
        // Ignore errors - prefetch is best effort
      });
    } else if ("requestIdleCallback" in window) {
      // Prefetch during idle time
      window.requestIdleCallback(() => {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = url;
        link.as =
          url.endsWith(".glb") || url.endsWith(".gltf") ? "fetch" : "image";
        document.head.appendChild(link);
      });
    }

    prefetchedRef.current.add(url);
  }, [url, enabled, priority]);
}

/**
 * Prefetch multiple resources
 */
export function usePrefetchMultiple(
  urls: string[],
  options: PrefetchOptions = {},
): void {
  const { enabled = true, priority = "low" } = options;

  useEffect(() => {
    if (!enabled || urls.length === 0) return;

    // Prefetch resources during idle time
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => {
        urls.forEach((url) => {
          const link = document.createElement("link");
          link.rel = "prefetch";
          link.href = url;
          link.as =
            url.endsWith(".glb") || url.endsWith(".gltf") ? "fetch" : "image";
          document.head.appendChild(link);
        });
      });
    }
  }, [urls, enabled, priority]);
}
