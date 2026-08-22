/**
 * Hook to create stable callbacks that don't change on every render
 * Useful for preventing unnecessary re-renders of memoized components
 */

import { useRef, useCallback } from "react";

/**
 * Creates a stable callback that always calls the latest version of the function
 * without causing re-renders when the function reference changes
 */

export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
): T {
  const callbackRef = useRef(callback);

  // Update ref when callback changes
  callbackRef.current = callback;

  // Return stable callback that always calls the latest version

  return useCallback(
    ((...args: Parameters<T>) => {
      return callbackRef.current(...args);
    }) as T,
    [], // Empty deps - callback never changes (intentional)
  );
}
