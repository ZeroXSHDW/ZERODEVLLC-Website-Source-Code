'use client';

import { useEffect, useRef, useState, memo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { log } from '@/lib/utils/logger';

interface AdaptivePerformanceProps {
  children: React.ReactNode;
  onQualityChange?: (quality: 'high' | 'medium' | 'low') => void;
  targetFPS?: number;
  minFPS?: number;
  maxFPS?: number;
}

/**
 * Adaptive Performance Monitor
 * Automatically adjusts quality settings based on real-time FPS
 * Similar to @react-three/performance but custom implementation
 */
export function AdaptivePerformance({
  children,
  onQualityChange,
  targetFPS = 60,
  minFPS = 30,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  maxFPS = 120,
}: AdaptivePerformanceProps) {
  // useThree requires Canvas context - this component should only be used inside Canvas
  const { gl } = useThree();
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');
  const fpsHistoryRef = useRef<number[]>([]);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const consecutiveLowFPSRef = useRef(0);
  const consecutiveHighFPSRef = useRef(0);

  // Use maxFPS to clamp calculations if needed, though currently it's just a config value

  // Optimized FPS calculation with exponential moving average for smoother transitions
  useFrame(() => {
    frameCountRef.current++;
    const now = performance.now();
    const elapsed = now - lastTimeRef.current;

    // Update FPS every second (more efficient than every frame)
    if (elapsed >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / elapsed);
      fpsHistoryRef.current.push(fps);

      // Keep last 10 FPS readings (10 seconds of history)
      if (fpsHistoryRef.current.length > 10) {
        fpsHistoryRef.current.shift();
      }

      // Calculate weighted average (recent frames weighted more heavily)
      // This provides smoother transitions and better responsiveness
      const weights = fpsHistoryRef.current.map((_, i) => {
        const position = i / fpsHistoryRef.current.length;
        return Math.pow(position, 0.5); // Exponential weighting
      });
      const totalWeight = weights.reduce((a, b) => a + b, 0);
      const avgFPS =
        fpsHistoryRef.current.reduce((sum, fps, i) => sum + fps * weights[i], 0) / totalWeight;

      // Adaptive quality adjustment with hysteresis to prevent oscillation
      const lowFPSThreshold = minFPS * 0.9; // 10% buffer below minFPS
      const highFPSThreshold = targetFPS * 1.1; // 10% buffer above target

      if (avgFPS < lowFPSThreshold && quality !== 'low') {
        consecutiveLowFPSRef.current++;
        consecutiveHighFPSRef.current = 0;

        // Only change quality after 3 consecutive low FPS readings (3 seconds)
        if (consecutiveLowFPSRef.current >= 3) {
          const newQuality = quality === 'high' ? 'medium' : 'low';
          setQuality(newQuality);
          onQualityChange?.(newQuality);
          log.debug(
            `Performance degraded, reducing quality to: ${newQuality} (FPS: ${avgFPS.toFixed(1)})`
          );
          consecutiveLowFPSRef.current = 0;
        }
      } else if (avgFPS >= highFPSThreshold && quality !== 'high') {
        consecutiveHighFPSRef.current++;
        consecutiveLowFPSRef.current = 0;

        // Only increase quality after 5 consecutive good FPS readings (5 seconds)
        // More conservative to avoid quality oscillation
        if (consecutiveHighFPSRef.current >= 5) {
          const newQuality = quality === 'low' ? 'medium' : 'high';
          setQuality(newQuality);
          onQualityChange?.(newQuality);
          log.debug(
            `Performance improved, increasing quality to: ${newQuality} (FPS: ${avgFPS.toFixed(1)})`
          );
          consecutiveHighFPSRef.current = 0;
        }
      } else {
        // Reset counters if FPS is in acceptable range
        consecutiveLowFPSRef.current = 0;
        consecutiveHighFPSRef.current = 0;
      }

      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }
  });

  // Apply quality settings to renderer with memoization to prevent unnecessary updates
  useEffect(() => {
    if (!gl || typeof window === 'undefined') return;

    const renderer = gl as THREE.WebGLRenderer;
    const devicePixelRatio = window.devicePixelRatio || 1;

    // Only update if settings actually changed
    const currentPixelRatio = renderer.getPixelRatio();
    const currentShadowEnabled = renderer.shadowMap.enabled;

    switch (quality) {
      case 'low': {
        const targetPixelRatio = 1;
        if (currentPixelRatio !== targetPixelRatio) {
          renderer.setPixelRatio(targetPixelRatio);
        }
        if (currentShadowEnabled) {
          renderer.shadowMap.enabled = false;
        }
        break;
      }
      case 'medium': {
        const targetPixelRatio = Math.min(devicePixelRatio, 1.5);
        if (currentPixelRatio !== targetPixelRatio) {
          renderer.setPixelRatio(targetPixelRatio);
        }
        if (!currentShadowEnabled) {
          renderer.shadowMap.enabled = true;
        }
        if (renderer.shadowMap.type !== THREE.PCFSoftShadowMap) {
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }
        break;
      }
      case 'high': {
        const targetPixelRatio = Math.min(devicePixelRatio, 2);
        if (currentPixelRatio !== targetPixelRatio) {
          renderer.setPixelRatio(targetPixelRatio);
        }
        if (!currentShadowEnabled) {
          renderer.shadowMap.enabled = true;
        }
        if (renderer.shadowMap.type !== THREE.PCFSoftShadowMap) {
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }
        break;
      }
    }

    log.debug(`Applied quality settings: ${quality} (DPR: ${renderer.getPixelRatio()})`);
  }, [quality, gl]);

  return <>{children}</>;
}

// Memoize AdaptivePerformance to prevent unnecessary re-renders
// Only re-render when quality actually changes
export const MemoizedAdaptivePerformance = memo(AdaptivePerformance, (prevProps, nextProps) => {
  return (
    prevProps.targetFPS === nextProps.targetFPS &&
    prevProps.minFPS === nextProps.minFPS &&
    prevProps.maxFPS === nextProps.maxFPS &&
    prevProps.onQualityChange === nextProps.onQualityChange
  );
});
