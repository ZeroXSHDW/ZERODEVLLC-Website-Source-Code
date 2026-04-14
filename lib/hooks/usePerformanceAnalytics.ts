/**
 * Hook for performance analytics tracking
 */

import { useEffect, useRef } from 'react';
import { performanceAnalytics } from '@/lib/utils/performanceAnalytics';
import { useFrame } from '@react-three/fiber';
import { useThree } from '@react-three/fiber';

interface UsePerformanceAnalyticsOptions {
  enabled?: boolean;
  reportInterval?: number; // Report every N frames
  analyticsEndpoint?: string;
}

/**
 * Tracks and reports performance metrics
 */
export function usePerformanceAnalytics(options: UsePerformanceAnalyticsOptions = {}) {
  const {
    enabled = true,
    reportInterval = 300, // Every 5 seconds at 60 FPS
    analyticsEndpoint,
  } = options;

  const { gl } = useThree();
  const frameCountRef = useRef(0);
  const lastReportTimeRef = useRef(performance.now());
  const fpsHistoryRef = useRef<number[]>([]);

  // Track frame rate
  useFrame(() => {
    if (!enabled) return;

    frameCountRef.current++;
    const now = performance.now();
    const delta = now - lastReportTimeRef.current;

    if (delta >= 1000) { // Every second
      const fps = (frameCountRef.current * 1000) / delta;
      fpsHistoryRef.current.push(fps);
      if (fpsHistoryRef.current.length > 60) {
        fpsHistoryRef.current.shift();
      }

      const avgFPS = fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length;
      performanceAnalytics.recordMetric('frameRate', avgFPS);

      frameCountRef.current = 0;
      lastReportTimeRef.current = now;
    }

    // Report periodically
    if (frameCountRef.current % reportInterval === 0) {
      const rendererInfo = gl.info;
      performanceAnalytics.recordMetrics({
        drawCalls: rendererInfo.render.calls,
        triangleCount: rendererInfo.render.triangles,
      });

      // Get memory usage if available
      if ('memory' in performance) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const memInfo = (performance as any).memory;
        performanceAnalytics.recordMetric('memoryUsage', memInfo.usedJSHeapSize / 1024 / 1024); // MB
      }

      // Send to analytics if endpoint provided
      if (analyticsEndpoint) {
        performanceAnalytics.sendToAnalytics(analyticsEndpoint);
      }
    }
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (analyticsEndpoint) {
        performanceAnalytics.sendToAnalytics(analyticsEndpoint);
      }
    };
  }, [analyticsEndpoint]);
}

