/**
 * Optimized viewer settings hook
 * Splits settings into smaller memoized pieces to prevent unnecessary re-renders
 */

import { useState, useMemo, useCallback } from "react";
import type { ViewerSettings } from "@/lib/types/3d";

export function useViewerSettings(
  initialSettings: Partial<ViewerSettings> = {},
) {
  // Split settings into smaller pieces for better memoization
  const [autoRotate, setAutoRotate] = useState(
    initialSettings.autoRotate ?? true,
  );
  const [rotationSpeed, setRotationSpeed] = useState(
    initialSettings.rotationSpeed ?? 0.5,
  );
  const [scale, setScale] = useState(initialSettings.scale ?? 1);
  const [performanceMode, setPerformanceMode] = useState(
    initialSettings.performanceMode ?? false,
  );

  const [lighting, setLighting] = useState(
    initialSettings.lighting ?? {
      ambient: 0.4,
      directional: 1.2,
      point: 0.5,
    },
  );

  const [environment, setEnvironment] = useState(
    initialSettings.environment ?? {
      preset: "studio" as const,
      intensity: 1,
      enabled: true,
    },
  );

  const [postProcessing, setPostProcessing] = useState(
    initialSettings.postProcessing ?? {
      toneMapping: {
        enabled: true,
        exposure: 1.0,
      },
    },
  );

  const [lod, setLod] = useState(
    initialSettings.lod ?? {
      enabled: true,
      quality: "auto" as const,
    },
  );

  // Memoize combined settings object to prevent recreation
  const settings = useMemo<ViewerSettings>(
    () => ({
      autoRotate,
      rotationSpeed,
      scale,
      lighting,
      environment,
      postProcessing,
      performanceMode,
      lod,
    }),
    [
      autoRotate,
      rotationSpeed,
      scale,
      lighting,
      environment,
      postProcessing,
      performanceMode,
      lod,
    ],
  );

  // Memoized update functions
  const updateLighting = useCallback((updates: Partial<typeof lighting>) => {
    setLighting((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateEnvironment = useCallback(
    (updates: Partial<typeof environment>) => {
      setEnvironment((prev) => ({ ...prev, ...updates }));
    },
    [],
  );

  const updatePostProcessing = useCallback(
    (updates: {
      toneMapping?: Partial<(typeof postProcessing)["toneMapping"]>;
    }) => {
      setPostProcessing((prev) => ({
        ...prev,
        toneMapping: { ...prev.toneMapping, ...updates.toneMapping },
      }));
    },
    [],
  );

  const updateLod = useCallback((updates: Partial<typeof lod>) => {
    setLod((prev) => ({ ...prev, ...updates }));
  }, []);

  return {
    settings,
    // Individual setters
    setAutoRotate,
    setRotationSpeed,
    setScale,
    setPerformanceMode,
    updateLighting,
    updateEnvironment,
    updatePostProcessing,
    updateLod,
  };
}
