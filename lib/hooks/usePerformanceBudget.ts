/**
 * Hook for performance budget monitoring
 */

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { performanceBudget } from "@/lib/utils/performanceBudget";
import { log } from "@/lib/utils/logger";

interface UsePerformanceBudgetOptions {
  enabled?: boolean;
  targetFPS?: number;
  onBudgetExceeded?: (quality: "high" | "medium" | "low") => void;
  logStats?: boolean;
}

/**
 * Monitors frame time and triggers optimizations when budget is exceeded
 */
export function usePerformanceBudget(
  options: UsePerformanceBudgetOptions = {},
) {
  const {
    enabled = true,
    targetFPS = 60,
    onBudgetExceeded,
    logStats = false,
  } = options;

  const lastFrameTimeRef = useRef(performance.now());
  const logIntervalRef = useRef(0);

  // Update budget target FPS
  useEffect(() => {
    const targetFrameTime = 1000 / targetFPS;
    const maxFrameTime = targetFrameTime * 2; // Allow up to 2x for minimum acceptable FPS

    performanceBudget.updateBudget({
      targetFrameTime,
      maxFrameTime,
    });
  }, [targetFPS]);

  useFrame(() => {
    if (!enabled) return;

    const now = performance.now();
    const frameTime = now - lastFrameTimeRef.current;
    lastFrameTimeRef.current = now;

    // Record frame time
    performanceBudget.recordFrame(frameTime);

    // Check if budget is exceeded
    if (performanceBudget.isBudgetExceeded()) {
      const recommendedQuality = performanceBudget.getRecommendedQuality();
      onBudgetExceeded?.(recommendedQuality);
    }

    // Log stats periodically
    if (logStats) {
      logIntervalRef.current++;
      if (logIntervalRef.current % 60 === 0) {
        // Every 60 frames
        const stats = performanceBudget.getStats();
        log.debug("Performance budget stats:", {
          avgFrameTime: `${stats.averageFrameTime.toFixed(2)}ms`,
          currentFPS: `${(1000 / stats.currentFrameTime).toFixed(1)}`,
          budgetExceeded: stats.budgetExceeded,
          recommendedQuality: performanceBudget.getRecommendedQuality(),
        });
      }
    }
  });
}
