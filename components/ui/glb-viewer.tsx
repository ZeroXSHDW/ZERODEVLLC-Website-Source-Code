"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { toast } from "sonner";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { MODEL_CONFIG, CAMERA_PRESETS } from "@/config/three";
import { useWebGL } from "@/lib/hooks/useWebGL";
import { useKeyboardShortcuts } from "@/lib/hooks/useKeyboardShortcuts";
import { useViewerState } from "@/lib/hooks/useViewerState";
import { useModelState } from "@/lib/hooks/useModelState";
import { useDeviceState } from "@/lib/hooks/useDeviceState";
import { LoadingFallback } from "@/components/ui/LoadingFallback";
import { ErrorFallback } from "@/components/ui/ErrorFallback";
import { ViewerActionButtons } from "@/components/ui/ViewerActionButtons";
import {
  LazyKeyboardShortcutsHelp,
  LazyModelInfo,
  LazyMobileGestureHelp,
  LazyPerformanceMonitor,
  LazyMobileControls,
  LazyExportDialog,
  LazyControlsPanel,
  LazyCommandPalette,
  setupSmartPreloading,
} from "@/lib/utils/lazyComponents";
import { SkipLinks } from "@/components/ui/SkipLinks";
import { useAccessibility } from "@/lib/hooks/useAccessibility";
import { useViewerSettings } from "@/lib/hooks/useViewerSettings";
// Model loading is handled by Model component - no need to import useProgressiveLoader here
import { modelCache } from "@/lib/cache/modelCache";
import { swCache } from "@/lib/cache/serviceWorkerCache";
import { ClientOnly } from "@/components/ClientOnly";
import dynamic from "next/dynamic";
import { XRControlPanel } from "@/components/3d/XR";

const ThreeCanvas = dynamic(
  () => import("@/components/ThreeCanvas").then((mod) => mod.ThreeCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-full bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Initializing 3D Viewer...</p>
        </div>
      </div>
    ),
  },
);
import { ModelErrorBoundary } from "@/components/ErrorBoundary/ModelErrorBoundary";
import { CanvasErrorBoundary } from "@/components/ErrorBoundary/CanvasErrorBoundary";
import { handleModelError as classifyModelError } from "@/lib/utils/errorHandler";
import { log } from "@/lib/utils/logger";
import type { GLBViewerProps } from "@/lib/types";
import * as THREE from "three";

export default function GLBViewer({
  modelPath = MODEL_CONFIG.defaultModel,
  className,
  enableControls = true,
  autoRotate = true,
  onLoad,
  onError,
}: GLBViewerProps = {}) {
  // Separated state management using custom hooks
  const {
    uiState,
    toggleControlsPanel,
    toggleKeyboardHelp,
    toggleModelInfo,
    togglePerformanceMonitor,
    toggleExportDialog,
    toggleMobileGestureHelp,
    toggleCommandPalette,
  } = useViewerState();

  const {
    modelState,
    setLoadingProgress,
    setModelLoaded,
    setModelError,
    setUploadedFile,
    setAnimations,
    setCurrentAnimation,
    setAnimationPlaying,
  } = useModelState();

  const { deviceState, setTouchStartTime, setLastTapTime } = useDeviceState();

  // Optimized settings management using custom hook
  const {
    settings: viewerSettings,
    setAutoRotate,
    setPerformanceMode,
    updateLighting: handleLightingChange,
    updateEnvironment: handleEnvironmentChange,
    updatePostProcessing: handlePostProcessingChange,
    setScale,
    setRotationSpeed,
    updateLod,
  } = useViewerSettings({
    autoRotate,
    rotationSpeed: MODEL_CONFIG.autoRotateSpeed,
    scale: MODEL_CONFIG.defaultScale,
  });

  // Separate xrMode since it rarely changes
  const [xrMode] = useState<"none" | "ar" | "vr">("none");

  const { isSupported, isAvailable, error: webglError } = useWebGL();

  // Model loading is handled by ThreeCanvas Model component via useModelLoader
  // We don't need to load it here - that would cause duplicate loading
  // Progress tracking is handled by Model component's onProgress callback

  // Check cache first for instant loading
  const cachedModel = useMemo(() => {
    if (modelPath) {
      return modelCache.get(modelPath);
    }
    return null;
  }, [modelPath]);

  // Prefetch model if not cached (defer to idle callback)
  useEffect(() => {
    if (
      modelPath &&
      !cachedModel &&
      typeof window !== "undefined" &&
      "requestIdleCallback" in window
    ) {
      window.requestIdleCallback(
        () => {
          // Prefetch the model file
          const link = document.createElement("link");
          link.rel = "prefetch";
          link.href = modelPath;
          link.as = "fetch";
          document.head.appendChild(link);
        },
        { timeout: 2000 },
      );
    }
  }, [modelPath, cachedModel]);

  // Use cached model if available
  useEffect(() => {
    if (cachedModel && !modelState.sceneData) {
      setModelLoaded(cachedModel.scene, cachedModel.animations || []);
      log.debug("Loaded model from cache:", modelPath);
    }
  }, [cachedModel, modelState.sceneData, modelPath, setModelLoaded]);

  // Service worker integration for offline caching
  useEffect(() => {
    swCache
      .register()
      .catch((error) => log.warn("Service worker registration failed:", error));
  }, []);
  const { announce } = useAccessibility();
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);

  // Mobile-specific optimizations (device detection handled by useDeviceState)

  const handleModelLoad = useCallback(
    async (scene?: THREE.Group) => {
      if (!scene) return;

      try {
        // Cache the loaded model for future use (defer to idle callback for better performance)
        if ("requestIdleCallback" in window) {
          window.requestIdleCallback(
            () => {
              modelCache.set(modelPath, {
                scene,
                animations: modelState.animations,
              });
            },
            { timeout: 2000 },
          );
        } else {
          // Fallback for browsers without requestIdleCallback
          setTimeout(() => {
            modelCache.set(modelPath, {
              scene,
              animations: modelState.animations,
            });
          }, 100);
        }

        // Update model state immediately (don't wait for caching)
        setModelLoaded(scene, modelState.animations);

        // Show success message (use requestAnimationFrame for better performance)
        const loadTime = modelState.loadTime;
        const message = loadTime
          ? `Model loaded successfully in ${loadTime}ms. Ready for interaction.`
          : "Model loaded successfully. Ready for interaction.";

        // Use requestAnimationFrame instead of setTimeout for better performance
        requestAnimationFrame(() => {
          toast.success(message);
          announce(message);
        });

        onLoad?.();
      } catch (error) {
        log.error("Model caching failed:", error);
        // Still update UI even if caching fails
        setModelLoaded(scene, modelState.animations);
        onLoad?.();
      }
    },
    [
      modelPath,
      modelState.animations,
      modelState.loadTime,
      setModelLoaded,
      onLoad,
      announce,
    ],
  );

  const handleAnimationsLoaded = useCallback(
    (
      loadedAnimations: THREE.AnimationClip[],
      actions: Record<string, THREE.AnimationAction>,
    ) => {
      setAnimations(loadedAnimations, actions);
    },
    [setAnimations],
  );

  const handleModelProgress = useCallback(
    (progress: number) => {
      setLoadingProgress(progress);
    },
    [setLoadingProgress],
  );

  const handleModelError = useCallback(
    (err: Error | import("@/lib/types/3d").ModelError) => {
      // If it's already a ModelError, use it directly
      const modelError =
        "type" in err ? err : classifyModelError(err, { url: modelPath });
      setModelError(modelError);
      toast.error("Failed to load model", {
        description: modelError.message,
      });
      onError?.(modelError.originalError || (err as Error)); // Pass original error to maintain compatibility
    },
    [modelPath, onError, setModelError],
  );

  const handleRetry = useCallback(() => {
    setModelError(null);
    setLoadingProgress(0);
  }, [setModelError, setLoadingProgress]);

  const handleCameraPreset = useCallback(
    (preset: keyof typeof CAMERA_PRESETS) => {
      if (!controlsRef.current) {
        toast.error("Camera controls not available");
        return;
      }

      try {
        const { position, target } = CAMERA_PRESETS[preset];

        // Set camera position
        controlsRef.current.object.position.set(...position);
        // Set controls target
        controlsRef.current.target.set(...target);
        // Update controls
        controlsRef.current.update();

        // Capitalize first letter for display
        const displayName = preset.charAt(0).toUpperCase() + preset.slice(1);
        toast.success(`Camera moved to ${displayName} view`);
      } catch {
        toast.error("Failed to change camera view");
      }
    },
    [],
  );

  const handleModelSettingsChange = useCallback(
    (settings: { scale?: number; rotationSpeed?: number }) => {
      if (settings.scale !== undefined) setScale(settings.scale);
      if (settings.rotationSpeed !== undefined)
        setRotationSpeed(settings.rotationSpeed);
    },
    [setScale, setRotationSpeed],
  );

  const handleResetView = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }

    if (deviceState.isMobile) {
      toast.success("View reset to default position");
    }
    announce("View reset to default position");
  }, [deviceState.isMobile, announce]);

  // Enhanced touch gesture handlers
  const handleTouchStart = useCallback(() => {
    setTouchStartTime(Date.now());
  }, [setTouchStartTime]);

  const handleTouchEnd = useCallback(() => {
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - (deviceState.touchStartTime || 0);

    // Double tap detection
    if (
      deviceState.lastTapTime &&
      touchEndTime - deviceState.lastTapTime < 300
    ) {
      // Double tap - reset view
      handleResetView();
      setLastTapTime(null);
      return;
    }

    setLastTapTime(touchEndTime);

    // Long press detection (500ms)
    if (touchDuration > 500) {
      toggleModelInfo();
    }
  }, [
    deviceState.touchStartTime,
    deviceState.lastTapTime,
    handleResetView,
    setLastTapTime,
    toggleModelInfo,
  ]);

  const handleToggleRotation = useCallback(() => {
    setAutoRotate(!viewerSettings.autoRotate);
  }, [setAutoRotate, viewerSettings.autoRotate]);

  const handlePerformanceToggle = useCallback(() => {
    setPerformanceMode(!viewerSettings.performanceMode);
  }, [setPerformanceMode, viewerSettings.performanceMode]);

  const handleFileUpload = useCallback(
    (file: File) => {
      try {
        // Validate file type
        if (
          !file.name.toLowerCase().endsWith(".glb") &&
          !file.name.toLowerCase().endsWith(".gltf")
        ) {
          toast.error("Invalid file type", {
            description: "Please upload a .glb or .gltf file",
          });
          return;
        }

        // Check file size (limit to 50MB)
        if (file.size > 50 * 1024 * 1024) {
          toast.error("File too large", {
            description: "Please upload a file smaller than 50MB",
          });
          return;
        }

        // Create blob URL for the uploaded file
        const url = URL.createObjectURL(file);
        setUploadedFile(url);

        toast.success(`Loading ${file.name}`, {
          description: `${(file.size / 1024 / 1024).toFixed(2)}MB file uploaded`,
        });
      } catch {
        toast.error("Upload failed", {
          description: "An unexpected error occurred while uploading",
        });
      }
    },
    [setUploadedFile],
  );

  // Animation controls
  const handleAnimationPlay = useCallback(() => {
    if (
      modelState.currentAnimation &&
      modelState.animationActions &&
      modelState.animationActions[modelState.currentAnimation]
    ) {
      modelState.animationActions[modelState.currentAnimation]?.play();
      setAnimationPlaying(true);
    }
  }, [
    modelState.currentAnimation,
    modelState.animationActions,
    setAnimationPlaying,
  ]);

  const handleAnimationPause = useCallback(() => {
    if (
      modelState.currentAnimation &&
      modelState.animationActions &&
      modelState.animationActions[modelState.currentAnimation]
    ) {
      modelState.animationActions[modelState.currentAnimation]!.paused = true;
      setAnimationPlaying(false);
    }
  }, [
    modelState.currentAnimation,
    modelState.animationActions,
    setAnimationPlaying,
  ]);

  const handleAnimationSelect = useCallback(
    (animationName: string) => {
      // Stop current animation
      if (
        modelState.currentAnimation &&
        modelState.animationActions &&
        modelState.animationActions[modelState.currentAnimation]
      ) {
        modelState.animationActions[modelState.currentAnimation]?.stop();
      }

      // Start new animation
      setCurrentAnimation(animationName);
      if (
        modelState.animationActions &&
        modelState.animationActions[animationName]
      ) {
        modelState.animationActions[animationName]?.play();
        setAnimationPlaying(true);
      }
    },
    [
      modelState.currentAnimation,
      modelState.animationActions,
      setCurrentAnimation,
      setAnimationPlaying,
    ],
  );

  const handleScreenshot = useCallback(() => {
    toggleExportDialog();
  }, [toggleExportDialog]);

  const handleToggleControlsPanel = useCallback(() => {
    toggleControlsPanel();
  }, [toggleControlsPanel]);

  // Command Palette Actions
  const commandPaletteActions = useMemo(
    () => ({
      setAutoRotate,
      setPerformanceMode,
      onResetView: handleResetView,
      onCameraPreset: handleCameraPreset,
      updateLighting: handleLightingChange,
      updateEnvironment: handleEnvironmentChange,
      updateLod,
      toggleModelInfo,
      toggleControls: handleToggleControlsPanel,
    }),
    [
      setAutoRotate,
      setPerformanceMode,
      handleResetView,
      handleCameraPreset,
      handleLightingChange,
      handleEnvironmentChange,
      updateLod,
      toggleModelInfo,
      handleToggleControlsPanel,
    ],
  );

  // Open Command Palette with Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleCommandPalette(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggleCommandPalette]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onResetView: handleResetView,
    onToggleRotation: handleToggleRotation,
    onToggleControls: handleToggleControlsPanel,
    onPerformanceToggle: handlePerformanceToggle,
    onToggleKeyboardHelp: toggleKeyboardHelp,
    onToggleModelInfo: () => {
      if (modelState.sceneData) toggleModelInfo();
    },
    onCameraPreset: handleCameraPreset,
  });

  // Smart preloading of heavy components
  useEffect(() => {
    const cleanup = setupSmartPreloading();
    return cleanup;
  }, []);

  // Cleanup uploaded file URL on unmount
  useEffect(() => {
    return () => {
      // Cleanup handled by setUploadedFile hook
      if (modelState.uploadedFileUrl) {
        URL.revokeObjectURL(modelState.uploadedFileUrl);
      }
    };
  }, [modelState.uploadedFileUrl]);

  // Performance: Reduce update frequency when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Reduce performance when tab is not visible
        setPerformanceMode(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [setPerformanceMode]);

  // Show WebGL error if not supported (client-only check)
  const [webglCheckComplete, setWebglCheckComplete] = useState(false);
  const [webglErrorState, setWebglErrorState] = useState<string | null>(null);

  useEffect(() => {
    // Only check WebGL on client side
    if (typeof window !== "undefined") {
      // Use the existing hook result
      if (!isSupported || !isAvailable) {
        setWebglErrorState(webglError || "WebGL not supported");
      }
      setWebglCheckComplete(true);
    }
  }, [isSupported, isAvailable, webglError]);

  // Show WebGL error if not supported
  if (webglCheckComplete && webglErrorState) {
    return (
      <ErrorFallback error={new Error(webglErrorState)} onRetry={handleRetry} />
    );
  }

  // Show error state
  if (modelState.error && !modelState.isLoaded) {
    return <ErrorFallback error={modelState.error} onRetry={handleRetry} />;
  }

  return (
    <div
      className={`w-full h-full relative ${className || ""}`}
      onTouchStart={deviceState.isMobile ? handleTouchStart : undefined}
      onTouchEnd={deviceState.isMobile ? handleTouchEnd : undefined}
      role="application"
      aria-label="3D Model Viewer"
      aria-describedby="viewer-description"
      tabIndex={0}
    >
      {/* Hidden description for screen readers */}
      <div id="viewer-description" className="sr-only">
        Interactive 3D model viewer. Use mouse or touch to rotate, zoom, and pan
        the model. Press &apos;H&apos; for keyboard shortcuts, &apos;I&apos; for
        model information, &apos;P&apos; for performance monitor, &apos;C&apos;
        to toggle controls.
        {deviceState.isMobile
          ? " Double-tap to reset view, long-press for model info."
          : ""}
        {modelState.sceneData
          ? ` Currently viewing: ${modelState.uploadedFileUrl ? "Uploaded model" : modelPath.split("/").pop()}`
          : " Loading model..."}
      </div>

      {/* Skip Links for accessibility */}
      <SkipLinks />

      <CanvasErrorBoundary>
        <ClientOnly
          fallback={
            <div className="flex items-center justify-center w-full h-full bg-black text-white">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p>Initializing 3D Viewer...</p>
              </div>
            </div>
          }
        >
          <ModelErrorBoundary>
            <ThreeCanvas
              uploadedFileUrl={modelState.uploadedFileUrl}
              modelPath={modelPath}
              viewerSettings={viewerSettings}
              enableControls={enableControls}
              xrMode={xrMode}
              modelRef={modelRef}
              controlsRef={controlsRef}
              handleModelLoad={handleModelLoad}
              handleModelProgress={handleModelProgress}
              handleModelError={handleModelError}
              handleAnimationsLoaded={handleAnimationsLoaded}
            />
          </ModelErrorBoundary>
        </ClientOnly>
      </CanvasErrorBoundary>

      {/* Loading overlay */}
      {!modelState.isLoaded && !modelState.error && (
        <div className="absolute inset-0 z-10">
          <LoadingFallback
            progress={modelState.loadingProgress}
            message="Loading model..."
          />
        </div>
      )}

      {/* XR Controls (AR/VR buttons) */}
      <XRControlPanel
        arSupported={deviceState.arSupported}
        vrSupported={deviceState.vrSupported}
        xrMode={xrMode}
      />

      {/* Controls Panel */}
      <LazyControlsPanel
        isOpen={uiState.isControlsPanelOpen}
        onToggleAction={handleToggleControlsPanel}
        onCameraPreset={handleCameraPreset}
        onLightingChange={handleLightingChange}
        onModelSettingsChange={handleModelSettingsChange}
        onEnvironmentChange={handleEnvironmentChange}
        onPostProcessingChange={handlePostProcessingChange}
        onResetView={handleResetView}
        onToggleRotation={handleToggleRotation}
        onPerformanceToggle={handlePerformanceToggle}
        onFileUpload={handleFileUpload}
        onAnimationPlay={handleAnimationPlay}
        onAnimationPause={handleAnimationPause}
        onAnimationSelect={handleAnimationSelect}
        onScreenshot={handleScreenshot}
        onLodChange={updateLod}
        currentSettings={{
          ...viewerSettings,
          animations: {
            available: modelState.animations,
            current: modelState.currentAnimation,
            isPlaying: modelState.isAnimationPlaying,
          },
        }}
      />

      {/* Enhanced Action Buttons */}
      <ViewerActionButtons
        isMobile={deviceState.isMobile}
        hasSceneData={!!modelState.sceneData}
        onToggleModelInfo={toggleModelInfo}
        onToggleMobileGestureHelp={toggleMobileGestureHelp}
        onToggleKeyboardHelp={toggleKeyboardHelp}
        onTogglePerformanceMonitor={togglePerformanceMonitor}
        onToggleExportDialog={toggleExportDialog}
      />

      {/* Keyboard Shortcuts Help */}
      {/* @loadable/component handles Suspense internally */}
      <LazyKeyboardShortcutsHelp
        isOpen={uiState.isKeyboardHelpOpen}
        onClose={toggleKeyboardHelp}
      />

      {/* Model Info */}
      {modelState.sceneData && (
        <LazyModelInfo
          isOpen={uiState.isModelInfoOpen}
          onClose={toggleModelInfo}
          scene={modelState.sceneData}
          fileName={
            modelState.uploadedFileUrl
              ? "Uploaded Model"
              : modelPath.split("/").pop()
          }
          animations={modelState.animations}
          loadTime={modelState.loadTime || undefined}
        />
      )}

      {/* Mobile Gesture Help */}
      <LazyMobileGestureHelp
        isOpen={uiState.isMobileGestureHelpOpen}
        onClose={toggleMobileGestureHelp}
      />

      {/* Performance Monitor */}
      <LazyPerformanceMonitor
        isOpen={uiState.isPerformanceMonitorOpen}
        onClose={togglePerformanceMonitor}
      />

      {/* Export Dialog */}
      <LazyExportDialog
        isOpen={uiState.isExportDialogOpen}
        onClose={toggleExportDialog}
        canvas={
          typeof window !== "undefined"
            ? (document.querySelector("canvas") as HTMLCanvasElement | null)
            : null
        }
        modelName={
          modelState.uploadedFileUrl
            ? "Uploaded Model"
            : modelPath.split("/").pop()?.replace(".glb", "")
        }
      />

      {/* Mobile Controls */}
      <LazyMobileControls
        isControlsPanelOpen={uiState.isControlsPanelOpen}
        onToggleControlsPanel={handleToggleControlsPanel}
        onCameraPreset={handleCameraPreset}
        onScreenshot={handleScreenshot}
        onFileUpload={handleFileUpload}
        onPerformanceToggle={handlePerformanceToggle}
        onModelInfoToggle={toggleModelInfo}
        onHelpToggle={toggleKeyboardHelp}
        onResetView={handleResetView}
        onToggleRotation={handleToggleRotation}
        isAutoRotate={viewerSettings.autoRotate}
      />

      {/* Command Palette */}
      <LazyCommandPalette
        isOpen={uiState.isCommandPaletteOpen || false}
        onCloseAction={() => toggleCommandPalette(false)}
        actions={commandPaletteActions}
        currentSettings={viewerSettings}
      />
    </div>
  );
}
