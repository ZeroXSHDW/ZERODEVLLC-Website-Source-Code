/**
 * Hook for optimizing animation playback
 * Handles animation scheduling, blending, and performance optimization
 */

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

interface AnimationOptimizerOptions {
  enabled?: boolean;
  maxConcurrentAnimations?: number;
  blendDuration?: number;
}

/**
 * Optimizes animation playback for better performance
 */
export function useAnimationOptimizer(
  actions: Record<string, THREE.AnimationAction> | null,
  options: AnimationOptimizerOptions = {},
) {
  const {
    enabled = true,
    maxConcurrentAnimations = 2,
    blendDuration = 0.3,
  } = options;

  const activeAnimationsRef = useRef<Set<string>>(new Set());
  const animationQueueRef = useRef<string[]>([]);

  // Optimize animation playback
  const playAnimation = useCallback(
    (name: string, fadeIn = true) => {
      if (!actions || !actions[name] || !enabled) return;

      const action = actions[name];

      // Stop other animations if at max concurrent
      if (activeAnimationsRef.current.size >= maxConcurrentAnimations) {
        // Stop oldest animation
        const oldest = Array.from(activeAnimationsRef.current)[0];
        if (oldest && actions[oldest]) {
          actions[oldest].fadeOut(blendDuration);
          activeAnimationsRef.current.delete(oldest);
        }
      }

      // Play new animation
      if (fadeIn) {
        action.reset().fadeIn(blendDuration).play();
      } else {
        action.reset().play();
      }

      activeAnimationsRef.current.add(name);
    },
    [actions, enabled, maxConcurrentAnimations, blendDuration],
  );

  const stopAnimation = useCallback(
    (name: string, fadeOut = true) => {
      if (!actions || !actions[name]) return;

      const action = actions[name];
      if (fadeOut) {
        action.fadeOut(blendDuration);
      } else {
        action.stop();
      }

      activeAnimationsRef.current.delete(name);
    },
    [actions, blendDuration],
  );

  const stopAllAnimations = useCallback(
    (fadeOut = true) => {
      if (!actions) return;

      Object.keys(actions).forEach((name) => {
        stopAnimation(name, fadeOut);
      });
    },
    [actions, stopAnimation],
  );

  // Cleanup on unmount
  useEffect(() => {
    const activeAnimations = activeAnimationsRef.current;
    const animationQueue = animationQueueRef.current;

    return () => {
      stopAllAnimations(false);
      activeAnimations.clear();
      animationQueue.length = 0;
    };
  }, [stopAllAnimations]);

  return {
    playAnimation,
    stopAnimation,
    stopAllAnimations,
    activeAnimations: Array.from(activeAnimationsRef.current),
  };
}
