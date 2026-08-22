/**
 * Hook for adaptive quality based on performance metrics
 * Automatically adjusts rendering quality based on FPS and frame time
 */

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import type { ViewerSettings } from "@/lib/types/3d";

export type QualityLevel = "high" | "medium" | "low";

interface AdaptiveQualityState {
  quality: QualityLevel;
  fps: number;
  frameTime: number;
  adjustmentReason: string | null;
}

interface UseAdaptiveQualityOptions {
  enabled?: boolean;
  targetFPS?: number;
  lowFPSThreshold?: number;
  highFPSThreshold?: number;
  adjustmentCooldown?: number; // milliseconds
  onQualityChange?: (quality: QualityLevel) => void;
}

const DEFAULT_OPTIONS: Required<UseAdaptiveQualityOptions> = {
  enabled: true,
  targetFPS: 60,
  lowFPSThreshold: 45,
  highFPSThreshold: 55,
  adjustmentCooldown: 2000,
  onQualityChange: () => {},
};

/**
 * Automatically adjusts rendering quality based on performance
 */
export function useAdaptiveQuality(
  currentFPS: number,
  currentFrameTime: number,
  options: UseAdaptiveQualityOptions = {},
) {
  // Memoize options to prevent dependency issues

  const opts = useMemo(() => ({ ...DEFAULT_OPTIONS, ...options }), [options]);
  const [state, setState] = useState<AdaptiveQualityState>({
    quality: "high",
    fps: currentFPS,
    frameTime: currentFrameTime,
    adjustmentReason: null,
  });

  const lastAdjustmentRef = useRef<number>(0);
  const qualityHistoryRef = useRef<QualityLevel[]>([]);

  // Update FPS and frame time
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      fps: currentFPS,
      frameTime: currentFrameTime,
    }));
  }, [currentFPS, currentFrameTime]);

  // Adaptive quality adjustment
  useEffect(() => {
    if (!opts.enabled) return;

    const now = Date.now();
    if (now - lastAdjustmentRef.current < opts.adjustmentCooldown) {
      return; // Cooldown period
    }

    setState((currentState) => {
      const { quality, fps } = currentState;

      // Determine if we need to adjust quality
      let newQuality: QualityLevel = quality;
      let reason: string | null = null;

      // Performance is poor - reduce quality
      if (fps < opts.lowFPSThreshold && quality !== "low") {
        if (quality === "high") {
          newQuality = "medium";
          reason = `FPS dropped to ${fps.toFixed(1)} (below ${opts.lowFPSThreshold})`;
        } else if (quality === "medium") {
          newQuality = "low";
          reason = `FPS dropped to ${fps.toFixed(1)} (below ${opts.lowFPSThreshold})`;
        }
      }
      // Performance is good - increase quality
      else if (fps >= opts.highFPSThreshold && quality !== "high") {
        // Only increase if we've been stable for a while
        qualityHistoryRef.current.push(quality);
        if (qualityHistoryRef.current.length > 10) {
          qualityHistoryRef.current.shift();
        }

        // Check if we've been stable at current quality
        const isStable = qualityHistoryRef.current.every((q) => q === quality);
        if (isStable && qualityHistoryRef.current.length >= 5) {
          if (quality === "low") {
            newQuality = "medium";
            reason = `FPS stable at ${fps.toFixed(1)} (above ${opts.highFPSThreshold})`;
          } else if (quality === "medium") {
            newQuality = "high";
            reason = `FPS stable at ${fps.toFixed(1)} (above ${opts.highFPSThreshold})`;
          }
        }
      }

      // Apply quality change
      if (newQuality !== quality) {
        lastAdjustmentRef.current = now;
        opts.onQualityChange(newQuality);
        return {
          ...currentState,
          quality: newQuality,
          adjustmentReason: reason,
        };
      }
      return currentState;
    });
  }, [opts]);

  /**
   * Manually set quality level
   */
  const setQuality = useCallback(
    (quality: QualityLevel, reason?: string) => {
      setState((prev) => ({
        ...prev,
        quality,
        adjustmentReason: reason || `Manually set to ${quality}`,
      }));
      opts.onQualityChange(quality);
      lastAdjustmentRef.current = Date.now();
    },
    [opts],
  );

  /**
   * Convert quality level to viewer settings
   */
  const getViewerSettings = useCallback(
    (baseSettings: ViewerSettings): ViewerSettings => {
      const qualitySettings: Partial<ViewerSettings> = {
        performanceMode: state.quality === "low",
        lod: {
          enabled: true,
          quality: state.quality === "high" ? "auto" : state.quality,
        },
        postProcessing: {
          toneMapping: {
            enabled: state.quality !== "low",
            exposure: state.quality === "high" ? 1.0 : 0.9,
          },
        },
      };

      return {
        ...baseSettings,
        ...qualitySettings,
      };
    },
    [state.quality],
  );

  return {
    quality: state.quality,
    fps: state.fps,
    frameTime: state.frameTime,
    adjustmentReason: state.adjustmentReason,
    setQuality,
    getViewerSettings,
  };
}
