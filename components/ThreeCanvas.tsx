'use client';

import React, { Suspense, useMemo, useEffect, useState, memo } from 'react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Canvas } from '@react-three/fiber';
import { CAMERA_CONFIG, CANVAS_CONFIG } from '@/config/three';
import type { ViewerSettings } from '@/lib/types/3d';
import { useStableCallback } from '@/lib/hooks/useStableCallback';
import { Model } from './3d/Model';
import { Lighting } from './3d/Lighting';
import { Controls } from './3d/Controls';
import { Environment } from './3d/Environment';
import { PostProcessing } from './3d/PostProcessing';
import { XRSupport } from './3d/XR';
import { SceneOptimizer } from './3d/SceneOptimizer';
import { AdaptivePerformance } from './3d/AdaptivePerformance';
import { useMemoryCleanup } from '@/lib/hooks/useMemoryCleanup';

interface ThreeCanvasProps {
  uploadedFileUrl: string | null;
  modelPath: string;
  viewerSettings: ViewerSettings;
  enableControls: boolean;
  xrMode: 'none' | 'ar' | 'vr';
  modelRef: React.RefObject<THREE.Group>;
  controlsRef: React.RefObject<OrbitControlsImpl>;
  handleModelLoad: (scene: THREE.Group) => void;
  handleModelProgress: (progress: number) => void;
  handleModelError: (error: Error | import('@/lib/types/3d').ModelError) => void;
  handleAnimationsLoaded: (
    animations: THREE.AnimationClip[],
    actions: Record<string, THREE.AnimationAction>
  ) => void;
  onQualityChange?: (quality: 'high' | 'medium' | 'low') => void;
}

export function ThreeCanvas({
  uploadedFileUrl,
  modelPath,
  viewerSettings,
  enableControls,
  xrMode,
  modelRef,
  controlsRef,
  handleModelLoad,
  handleModelProgress,
  handleModelError,
  handleAnimationsLoaded,
  onQualityChange,
}: ThreeCanvasProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component only renders on client
  useEffect(() => {
    // Double-check we're on client
    if (typeof window !== 'undefined') {
      setIsMounted(true);
    }
  }, []);

  // Split viewerSettings access to only depend on what actually changes
  // Extract performanceMode early to avoid accessing viewerSettings multiple times
  const performanceMode = viewerSettings.performanceMode;

  // Memoize DPR calculation to avoid recalculation on every render
  const dpr = useMemo(() => {
    if (!isMounted || typeof window === 'undefined') return 1;
    if (performanceMode) return 1;
    return Math.min(window.devicePixelRatio || 1, 2);
  }, [performanceMode, isMounted]);
  const glConfig = useMemo(
    () => ({
      alpha: CANVAS_CONFIG.alpha,
      antialias: CANVAS_CONFIG.antialias && !performanceMode,
      powerPreference: (performanceMode ? 'low-power' : CANVAS_CONFIG.powerPreference) as
        | 'high-performance'
        | 'low-power'
        | 'default',
      stencil: false,
      depth: true,
      logarithmicDepthBuffer: !performanceMode, // Logarithmic depth buffer is more expensive
      preserveDrawingBuffer: true, // Necessary for screenshots
    }),
    [performanceMode]
  );

  // Use stable callbacks to prevent unnecessary re-renders
  // These callbacks never change, but always call the latest version of the function
  const handleModelLoadMemoized = useStableCallback(handleModelLoad);
  const handleModelProgressMemoized = useStableCallback(handleModelProgress);
  const handleModelErrorMemoized = useStableCallback(handleModelError);
  const handleAnimationsLoadedMemoized = useStableCallback(handleAnimationsLoaded);
  const handleQualityChangeMemoized = useStableCallback((quality: 'high' | 'medium' | 'low') => {
    onQualityChange?.(quality);
  });

  // Automatic memory management
  useMemoryCleanup({
    enabled: isMounted,
    memoryThreshold: performanceMode ? 200 : 500, // Stricter budget in performance mode
  });

  // Don't render Canvas until mounted on client
  if (!isMounted || typeof window === 'undefined') {
    return null;
  }

  // Configs are constants, safe to access directly

  return (
    <Canvas
      camera={CAMERA_CONFIG}
      shadows={CANVAS_CONFIG.shadows && !performanceMode}
      gl={glConfig}
      // Performance optimizations
      frameloop={performanceMode ? 'demand' : 'always'}
      dpr={dpr}
      style={{ background: '#000000' }}
    >
      <XRSupport mode={xrMode}>
        <AdaptivePerformance
          onQualityChange={handleQualityChangeMemoized}
          targetFPS={performanceMode ? 30 : 60}
          minFPS={performanceMode ? 20 : 30}
        >
          <SceneOptimizer
            enableInstancing={!performanceMode}
            enableFrustumCulling={true}
            enablePerformanceBudget={true}
            enableContextLossHandling={true}
            targetFPS={performanceMode ? 30 : 60}
            onQualityChange={handleQualityChangeMemoized}
          />
          <Suspense fallback={null}>
            <MemoizedEnvironment
              enabled={viewerSettings.environment.enabled}
              preset={viewerSettings.environment.preset}
            />
            <MemoizedLighting
              ambientIntensity={viewerSettings.lighting.ambient}
              directionalIntensity={viewerSettings.lighting.directional}
              pointIntensity={viewerSettings.lighting.point}
              performanceMode={performanceMode}
            />
            <Model
              ref={modelRef}
              url={uploadedFileUrl || modelPath}
              scale={viewerSettings.scale}
              autoRotateSpeed={viewerSettings.autoRotate ? viewerSettings.rotationSpeed : 0}
              lodEnabled={viewerSettings.lod.enabled}
              lodQuality={viewerSettings.lod.quality}
              onLoad={handleModelLoadMemoized}
              onProgress={handleModelProgressMemoized}
              onError={handleModelErrorMemoized}
              onAnimationsLoaded={handleAnimationsLoadedMemoized}
            />
            <Controls
              enabled={enableControls && xrMode === 'none'}
              autoRotate={viewerSettings.autoRotate && xrMode === 'none'}
              performanceMode={performanceMode}
              ref={controlsRef}
            />

            {!performanceMode && xrMode === 'none' && (
              <MemoizedPostProcessing
                toneMappingEnabled={viewerSettings.postProcessing.toneMapping.enabled}
                toneMappingExposure={viewerSettings.postProcessing.toneMapping.exposure}
              />
            )}
          </Suspense>
        </AdaptivePerformance>
      </XRSupport>
    </Canvas>
  );
}

// Memoized sub-components with custom comparison to prevent unnecessary re-renders
const MemoizedEnvironment = memo(
  Environment,
  (prev, next) => prev.enabled === next.enabled && prev.preset === next.preset
);

const MemoizedLighting = memo(
  Lighting,
  (prev, next) =>
    prev.ambientIntensity === next.ambientIntensity &&
    prev.directionalIntensity === next.directionalIntensity &&
    prev.pointIntensity === next.pointIntensity &&
    prev.performanceMode === next.performanceMode
);

const MemoizedPostProcessing = memo(
  PostProcessing,
  (prev, next) =>
    prev.toneMappingEnabled === next.toneMappingEnabled &&
    prev.toneMappingExposure === next.toneMappingExposure
);
