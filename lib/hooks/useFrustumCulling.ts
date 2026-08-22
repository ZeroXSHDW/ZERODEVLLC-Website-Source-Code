/**
 * Hook for frustum culling optimization
 */

import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { frustumCuller } from "@/lib/utils/frustumCulling";
import { log } from "@/lib/utils/logger";

interface UseFrustumCullingOptions {
  enabled?: boolean;
  updateInterval?: number; // Update every N frames
  logStats?: boolean;
}

/**
 * Automatically culls objects outside the camera's view
 */
export function useFrustumCulling(options: UseFrustumCullingOptions = {}) {
  const { scene, camera } = useThree();
  const {
    enabled = true,
    updateInterval = 5, // Update every 5 frames
    logStats = false,
  } = options;

  const frameCountRef = useRef(0);

  useFrame(() => {
    if (!enabled) return;

    frameCountRef.current++;

    // Only update every N frames for performance
    if (frameCountRef.current % updateInterval === 0) {
      frustumCuller.cullScene(scene, camera);

      if (logStats) {
        const stats = frustumCuller.getStats();
        log.debug("Frustum culling stats:", {
          culled: stats.culledObjects,
          visible: stats.visibleObjects,
          total: stats.totalObjects,
          time: `${stats.cullingTime.toFixed(2)}ms`,
        });
      }
    }
  });

  // Reset visibility on unmount
  useEffect(() => {
    return () => {
      frustumCuller.resetVisibility(scene);
    };
  }, [scene]);
}
