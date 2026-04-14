/**
 * Performance monitoring hook
 */

import { useEffect, useRef, useState } from 'react';

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  renderTime: number;
}

/**
 * Hook to monitor rendering performance
 */
export const usePerformance = (enabled: boolean = false) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    frameTime: 0,
    renderTime: 0,
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(0);
  const renderStartRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const measureFrame = () => {
      const now = performance.now();
      frameCountRef.current++;

      if (now - lastTimeRef.current >= 1000) {
        const fps = frameCountRef.current;
        frameCountRef.current = 0;
        lastTimeRef.current = now;

        setMetrics(prev => ({
          ...prev,
          fps,
        }));
      }

      requestAnimationFrame(measureFrame);
    };

    const rafId = requestAnimationFrame(measureFrame);
    return () => cancelAnimationFrame(rafId);
  }, [enabled]);

  const startRender = () => {
    if (enabled) {
      renderStartRef.current = performance.now();
    }
  };

  const endRender = () => {
    if (enabled && renderStartRef.current > 0) {
      const renderTime = performance.now() - renderStartRef.current;
      setMetrics(prev => ({
        ...prev,
        renderTime,
        frameTime: renderTime,
      }));
    }
  };

  return { metrics, startRender, endRender };
};


