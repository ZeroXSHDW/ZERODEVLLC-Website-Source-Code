import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage?: number;
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
}

const DEFAULT_METRICS: PerformanceMetrics = {
  fps: 0,
  frameTime: 0,
  memoryUsage: 0,
  drawCalls: 0,
  triangles: 0,
  geometries: 0,
  textures: 0,
};

export function usePerformanceMonitor(enabled: boolean = true) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(DEFAULT_METRICS);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const lastUpdateRef = useRef(performance.now());
  const fpsHistoryRef = useRef<number[]>([]);
  const memoryCheckCountRef = useRef(0);
  const { gl } = useThree();

  // Memoize renderer reference to avoid re-renders
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Update renderer reference when gl changes (use useEffect to avoid render-phase updates)
  useEffect(() => {
    rendererRef.current = gl;
  }, [gl]);

  // Optimized metrics update - only update when needed
  const updateMetrics = useCallback(() => {
    if (!enabled) return;

    const now = performance.now();
    const deltaTime = now - lastUpdateRef.current;

    // Update metrics every 500ms for better responsiveness
    if (deltaTime >= 500) {
      const timeElapsed = now - lastTimeRef.current;
      const fps = frameCountRef.current > 0 ? Math.round((frameCountRef.current * 1000) / timeElapsed) : 0;
      const frameTime = frameCountRef.current > 0 ? timeElapsed / frameCountRef.current : 0;

      // Keep FPS history for smoothing (last 5 seconds)
      fpsHistoryRef.current.push(fps);
      if (fpsHistoryRef.current.length > 10) {
        fpsHistoryRef.current.shift();
      }

      const avgFps = fpsHistoryRef.current.length > 0
        ? Math.round(fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length)
        : fps;

      // Get memory usage less frequently (every 20 updates to reduce overhead)
      let memoryUsage: number | undefined;
      memoryCheckCountRef.current++;
      if ('memory' in performance && memoryCheckCountRef.current >= 20) {
        const memInfo = (performance as unknown as { memory: { usedJSHeapSize: number; totalJSHeapSize: number } }).memory;
        memoryUsage = Math.round(memInfo.usedJSHeapSize / 1024 / 1024); // MB
        memoryCheckCountRef.current = 0;
      }

      // Get renderer info if available
      let drawCalls = 0, triangles = 0, geometries = 0, textures = 0;
      if (rendererRef.current?.info) {
        const info = rendererRef.current.info;
        drawCalls = info.render.calls;
        triangles = info.render.triangles;
        geometries = info.memory.geometries;
        textures = info.memory.textures;
      }

      // Batch state update
      setMetrics(prev => ({
        ...prev,
        fps: avgFps,
        frameTime: Math.round(frameTime * 100) / 100,
        ...(memoryUsage !== undefined && { memoryUsage }),
        drawCalls,
        triangles,
        geometries,
        textures,
      }));

      frameCountRef.current = 0;
      lastTimeRef.current = now;
      lastUpdateRef.current = now;
    }
  }, [enabled]);

  // Use useFrame from React Three Fiber for frame counting
  useFrame(() => {
    if (enabled) {
      frameCountRef.current++;
      // Only check for updates occasionally, not every frame
      const now = performance.now();
      if (now - lastUpdateRef.current >= 100) { // Check every 100ms instead of every frame
        updateMetrics();
      }
    }
  });

  // Cleanup on unmount
  useEffect(() => {
    // Capture ref values to avoid stale closure warnings
    const fpsHistory = fpsHistoryRef.current;
    
    return () => {
      frameCountRef.current = 0;
      fpsHistory.length = 0;
      memoryCheckCountRef.current = 0;
    };
  }, []);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({ metrics }), [metrics]);
}
