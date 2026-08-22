/**
 * Hook for Intersection Observer API
 * Used for lazy loading and visibility-based optimizations
 */

import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  enabled?: boolean;
}

/**
 * Hook to observe element visibility using Intersection Observer
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {},
): [React.RefObject<T>, boolean] {
  const {
    threshold = 0,
    root = null,
    rootMargin = "0px",
    enabled = true,
  } = options;

  const elementRef = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    // Create observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsIntersecting(entry.isIntersecting);
        });
      },
      {
        threshold,
        root,
        rootMargin,
      },
    );

    // Start observing
    observerRef.current.observe(elementRef.current);

    // Cleanup - capture ref values to avoid stale closure
    const observer = observerRef.current;
    const element = elementRef.current;

    return () => {
      if (observer && element) {
        observer.unobserve(element);
        observer.disconnect();
      }
    };
  }, [threshold, root, rootMargin, enabled]);

  return [elementRef, isIntersecting];
}

/**
 * Hook to defer work until browser is idle
 */
export function useIdleCallback(
  callback: () => void,
  options: { timeout?: number; enabled?: boolean } = {},
): void {
  const { timeout = 5000, enabled = true } = options;
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const executeCallback = () => {
      callbackRef.current();
    };

    // Use requestIdleCallback if available, otherwise use setTimeout
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(executeCallback, { timeout });
      return () => window.cancelIdleCallback(id);
    } else {
      // Fallback for browsers without requestIdleCallback
      const id = setTimeout(executeCallback, timeout);
      return () => clearTimeout(id);
    }
  }, [enabled, timeout]);
}
