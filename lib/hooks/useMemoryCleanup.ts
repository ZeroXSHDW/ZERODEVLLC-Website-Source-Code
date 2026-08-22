/**
 * Hook for automatic memory cleanup of Three.js resources
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { memoryManager } from "@/lib/utils/memoryManager";

interface UseMemoryCleanupOptions {
  enabled?: boolean;
  cleanupInterval?: number; // milliseconds
  memoryThreshold?: number; // MB
  renderer?: THREE.WebGLRenderer;
}

/**
 * Automatically cleans up Three.js resources when component unmounts
 * or when memory usage exceeds threshold
 */
export function useMemoryCleanup(options: UseMemoryCleanupOptions = {}) {
  const {
    enabled = true,
    cleanupInterval = 60000, // 1 minute
    memoryThreshold = 500, // 500 MB
    renderer,
  } = options;

  const cleanupIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const disposedObjectsRef = useRef<Set<THREE.Object3D>>(new Set());

  // Cleanup on unmount
  useEffect(() => {
    if (!enabled) return;

    // Capture ref value to avoid stale closure warning
    const disposedObjects = disposedObjectsRef.current;

    return () => {
      // Dispose all tracked objects
      const objectsToDispose = Array.from(disposedObjects);
      objectsToDispose.forEach((object) => {
        memoryManager.disposeObject(object);
      });
      disposedObjects.clear();

      // Clear renderer if provided
      if (renderer) {
        memoryManager.clearRenderer(renderer);
      }

      // Clear interval
      if (cleanupIntervalRef.current) {
        clearInterval(cleanupIntervalRef.current);
      }
    };
  }, [enabled, renderer]);

  // Periodic memory check and cleanup
  useEffect(() => {
    if (!enabled || !renderer) return;

    cleanupIntervalRef.current = setInterval(() => {
      const stats = memoryManager.getMemoryStats(renderer);
      const memoryMB = stats.totalMemory / (1024 * 1024);

      // If memory usage exceeds threshold, try to clean up
      if (memoryMB > memoryThreshold) {
        // Clear renderer programs cache
        memoryManager.clearRenderer(renderer);

        // Force garbage collection if available
        memoryManager.forceGC();
      }
    }, cleanupInterval);

    return () => {
      if (cleanupIntervalRef.current) {
        clearInterval(cleanupIntervalRef.current);
      }
    };
  }, [enabled, cleanupInterval, memoryThreshold, renderer]);

  /**
   * Register an object for automatic cleanup
   */
  const registerObject = (object: THREE.Object3D) => {
    if (enabled) {
      disposedObjectsRef.current.add(object);
    }
  };

  /**
   * Manually dispose an object
   */
  const disposeObject = (object: THREE.Object3D) => {
    memoryManager.disposeObject(object);
    disposedObjectsRef.current.delete(object);
  };

  return {
    registerObject,
    disposeObject,
    getMemoryStats: () => memoryManager.getMemoryStats(renderer),
  };
}
