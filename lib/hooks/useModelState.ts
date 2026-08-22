/**
 * Custom hook for managing model loading and state
 * Handles model data, animations, and loading progress
 */

import { useState, useCallback } from "react";
import * as THREE from "three";
import type { ModelError } from "@/lib/types/3d";

export interface ModelState {
  isLoaded: boolean;
  error: ModelError | null;
  loadingProgress: number;
  sceneData: THREE.Group | null;
  uploadedFileUrl: string | null;
  animations: THREE.AnimationClip[];
  animationActions: Record<string, THREE.AnimationAction> | null;
  currentAnimation: string | null;
  isAnimationPlaying: boolean;
  loadStartTime: number | null;
  loadTime: number | null;
}

const initialModelState: ModelState = {
  isLoaded: false,
  error: null,
  loadingProgress: 0,
  sceneData: null,
  uploadedFileUrl: null,
  animations: [],
  animationActions: null,
  currentAnimation: null,
  isAnimationPlaying: false,
  loadStartTime: null,
  loadTime: null,
};

export function useModelState() {
  const [modelState, setModelState] = useState<ModelState>(initialModelState);

  const setLoadingProgress = useCallback((progress: number) => {
    setModelState((prev) => {
      const updates: Partial<ModelState> = {
        loadingProgress: Math.min(progress, 1),
      };

      // Set load start time on first progress
      if (progress > 0 && !prev.loadStartTime) {
        updates.loadStartTime = Date.now();
      }

      return { ...prev, ...updates };
    });
  }, []);

  const setModelLoaded = useCallback(
    (scene: THREE.Group, animations?: THREE.AnimationClip[]) => {
      setModelState((prev) => ({
        ...prev,
        sceneData: scene,
        animations: animations || prev.animations,
        isLoaded: true,
        error: null,
        loadingProgress: 1,
        loadTime: prev.loadStartTime ? Date.now() - prev.loadStartTime : null,
      }));
    },
    [],
  );

  const setModelError = useCallback((error: ModelError | null) => {
    setModelState((prev) => ({
      ...prev,
      error,
      isLoaded: false,
      loadingProgress: error ? 0 : prev.loadingProgress,
    }));
  }, []);

  const setUploadedFile = useCallback((url: string | null) => {
    setModelState((prev) => {
      // Clean up previous URL
      if (prev.uploadedFileUrl && prev.uploadedFileUrl !== url) {
        URL.revokeObjectURL(prev.uploadedFileUrl);
      }

      return {
        ...prev,
        uploadedFileUrl: url,
        isLoaded: false,
        loadingProgress: 0,
        error: null,
        sceneData: null,
        animations: [],
        animationActions: null,
        currentAnimation: null,
        isAnimationPlaying: false,
        loadStartTime: null,
        loadTime: null,
      };
    });
  }, []);

  const setAnimations = useCallback(
    (
      animations: THREE.AnimationClip[],
      actions: Record<string, THREE.AnimationAction>,
    ) => {
      setModelState((prev) => {
        const updates: Partial<ModelState> = {
          animations,
          animationActions: actions,
        };

        // Set first animation as current if none selected
        if (animations.length > 0 && !prev.currentAnimation) {
          updates.currentAnimation = animations[0].name;
        }

        return { ...prev, ...updates };
      });
    },
    [],
  );

  const setCurrentAnimation = useCallback((animationName: string | null) => {
    setModelState((prev) => ({ ...prev, currentAnimation: animationName }));
  }, []);

  const setAnimationPlaying = useCallback((isPlaying: boolean) => {
    setModelState((prev) => ({ ...prev, isAnimationPlaying: isPlaying }));
  }, []);

  const resetModel = useCallback(() => {
    setModelState((prev) => {
      // Clean up uploaded file URL
      if (prev.uploadedFileUrl) {
        URL.revokeObjectURL(prev.uploadedFileUrl);
      }
      return initialModelState;
    });
  }, []);

  return {
    modelState,
    setLoadingProgress,
    setModelLoaded,
    setModelError,
    setUploadedFile,
    setAnimations,
    setCurrentAnimation,
    setAnimationPlaying,
    resetModel,
  };
}
