/**
 * Scene Optimizer Component
 * Applies various optimizations to the scene
 */

"use client";

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { optimizeSceneWithInstancing } from '@/lib/utils/instancing';
import { useFrustumCulling } from '@/lib/hooks/useFrustumCulling';
import { usePerformanceBudget } from '@/lib/hooks/usePerformanceBudget';
import { useWebGLContextLoss } from '@/lib/hooks/useWebGLContextLoss';
import { log } from '@/lib/utils/logger';

interface SceneOptimizerProps {
  enableInstancing?: boolean;
  enableFrustumCulling?: boolean;
  enablePerformanceBudget?: boolean;
  enableContextLossHandling?: boolean;
  instancingThreshold?: number;
  targetFPS?: number;
  onQualityChange?: (quality: 'high' | 'medium' | 'low') => void;
}

export function SceneOptimizer({
  enableInstancing = true,
  enableFrustumCulling = true,
  enablePerformanceBudget = true,
  enableContextLossHandling: _enableContextLossHandling = true,
  instancingThreshold = 5,
  targetFPS = 60,
  onQualityChange,
}: SceneOptimizerProps) {
  const { scene } = useThree();

  // Instancing optimization
  useEffect(() => {
    if (enableInstancing) {
      // Defer to idle callback for better performance
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          optimizeSceneWithInstancing(scene, instancingThreshold);
        }, { timeout: 2000 });
      } else {
        // Fallback: optimize on next frame
        requestAnimationFrame(() => {
          optimizeSceneWithInstancing(scene, instancingThreshold);
        });
      }
    }
  }, [scene, enableInstancing, instancingThreshold]);

  // Frustum culling
  useFrustumCulling({
    enabled: enableFrustumCulling,
    updateInterval: 5, // Update every 5 frames
    logStats: false,
  });

  // Performance budget monitoring
  usePerformanceBudget({
    enabled: enablePerformanceBudget,
    targetFPS,
    onBudgetExceeded: (quality) => {
      log.warn(`Performance budget exceeded, recommending quality: ${quality}`);
      onQualityChange?.(quality);
    },
    logStats: false,
  });

  // WebGL context loss handling
  const contextLossState = useWebGLContextLoss();

  useEffect(() => {
    if (contextLossState.lost) {
      log.error('WebGL context lost. Scene may need to be reloaded.');
    }
    if (contextLossState.restored) {
      log.info('WebGL context restored. Scene should be functional again.');
    }
  }, [contextLossState]);

  return null; // This component doesn't render anything
}

