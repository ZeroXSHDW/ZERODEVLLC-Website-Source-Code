import { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { retryModelLoad, handleModelError, type ModelError } from '@/lib/utils/errorHandler';

interface ProgressiveLoadState {
  phase: 'idle' | 'loading' | 'processing' | 'complete' | 'error';
  progress: number;
  currentPhase: string;
  estimatedTimeRemaining: number;
  loadedBytes: number;
  totalBytes: number;
}

interface LoadedModel {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
}

interface ProgressiveLoaderOptions {
  enableDraco?: boolean;
  maxConcurrentLoads?: number;
  priorityOrder?: ('geometry' | 'materials' | 'textures' | 'animations')[];
  onProgress?: (state: ProgressiveLoadState) => void;
  onPhaseChange?: (phase: string, progress: number) => void;
  onLoad?: (model: LoadedModel) => void;
  onError?: (error: Error | ModelError) => void;
}

const DEFAULT_OPTIONS: ProgressiveLoaderOptions = {
  enableDraco: true,
  maxConcurrentLoads: 3,
  priorityOrder: ['geometry', 'materials', 'textures', 'animations'],
};

export function useModelLoader(url: string, options: ProgressiveLoaderOptions = {}) {
  // Alias for backward compatibility
  return useProgressiveLoader(url, options);
}

export function useProgressiveLoader(url: string, options: ProgressiveLoaderOptions = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const [loadState, setLoadState] = useState<ProgressiveLoadState>({
    phase: 'idle',
    progress: 0,
    currentPhase: 'Initializing',
    estimatedTimeRemaining: 0,
    loadedBytes: 0,
    totalBytes: 0,
  });

  const [model, setModel] = useState<LoadedModel | null>(null);
  const [error, setError] = useState<Error | ModelError | null>(null);

  // Use refs for callbacks to avoid dependency issues and stale closures
  const onProgressRef = useRef(options.onProgress);
  const onLoadRef = useRef(options.onLoad);
  const onPhaseChangeRef = useRef(options.onPhaseChange);
  const onErrorRef = useRef(options.onError);

  // Update refs when callbacks change
  useEffect(() => {
    onProgressRef.current = options.onProgress;
    onLoadRef.current = options.onLoad;
    onPhaseChangeRef.current = options.onPhaseChange;
    onErrorRef.current = options.onError;
  }, [options.onProgress, options.onLoad, options.onPhaseChange, options.onError]);

  const loaderRef = useRef<GLTFLoader | null>(null);
  const dracoLoaderRef = useRef<DRACOLoader | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const startTimeRef = useRef<number>(0);

  const updateProgress = useCallback((phase: string, progress: number, loadedBytes = 0, totalBytes = 0) => {
    const now = performance.now();
    const elapsed = now - startTimeRef.current;
    const remaining = progress > 0 ? (elapsed / progress) * (1 - progress) : 0;

    setLoadState({
      phase: progress >= 1 ? 'complete' : 'loading',
      progress: Math.min(progress, 1),
      currentPhase: phase,
      estimatedTimeRemaining: remaining,
      loadedBytes,
      totalBytes,
    });

    onProgressRef.current?.({
      phase: progress >= 1 ? 'complete' : 'loading',
      progress: Math.min(progress, 1),
      currentPhase: phase,
      estimatedTimeRemaining: remaining,
      loadedBytes,
      totalBytes,
    });
  }, []);

  const loadProgressive = useCallback(async () => {
    if (!url) return;

    startTimeRef.current = performance.now();
    abortControllerRef.current = new AbortController();

    try {
      setLoadState(prev => ({ ...prev, phase: 'loading', currentPhase: 'Initializing loader' }));

      // Initialize loaders
      const loader = new GLTFLoader();
      loaderRef.current = loader;

    if (opts.enableDraco) {
      try {
        const dracoLoader = new DRACOLoader();
        // Try to use local Draco decoder, fallback to CDN if not available
        dracoLoader.setDecoderPath('/draco/');
        dracoLoader.preload();
        loader.setDRACOLoader(dracoLoader);
        dracoLoaderRef.current = dracoLoader;
      } catch (error) {
        // eslint-disable-next-line no-console
        if (process.env.NODE_ENV === 'development') {
          console.warn('Draco loader initialization failed, continuing without Draco compression:', error);
        }
        // Continue without Draco - GLTFLoader will still work with uncompressed models
      }
    }

      updateProgress('Initializing', 0.1);

      // Start loading with progress tracking and retry logic
      const loadWithRetry = async (): Promise<{ scene: THREE.Group; animations: THREE.AnimationClip[] }> => {
        return new Promise<{ scene: THREE.Group; animations: THREE.AnimationClip[] }>((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error(`Model loading timeout: ${url}`));
          }, 30000); // 30 second timeout

          loader.load(
            url,
            (gltf) => {
              clearTimeout(timeoutId);
              updateProgress('Processing model', 0.8);
              // GLTFLoader returns animations in gltf.animations array
              resolve({
                scene: gltf.scene,
                animations: gltf.animations || [],
              });
            },
            (progress) => {
              const loaded = progress.loaded || 0;
              const total = progress.total || 1;
              const loadProgress = Math.min(loaded / total, 0.7); // Reserve 70% for loading
              updateProgress('Downloading model', 0.1 + loadProgress * 0.6, loaded, total);
            },
            (error) => {
              clearTimeout(timeoutId);
              reject(error || new Error(`Failed to load model: ${url}`));
            }
          );
        });
      };

      const { scene, animations: gltfAnimations } = await retryModelLoad(() => loadWithRetry());

      // Process the loaded scene (removed artificial delays for better performance)
      updateProgress('Processing model data', 0.75);

      // GLTFLoader provides animations in gltf.animations, but also check scene.animations
      // as some models may have animations attached to the scene
      const animations: THREE.AnimationClip[] = [...gltfAnimations];
      
      // Also check scene.animations (some models attach animations here)
      if (scene.animations && scene.animations.length > 0) {
        // Avoid duplicates by checking UUID
        const existingUuids = new Set(animations.map(a => a.uuid));
        scene.animations.forEach(anim => {
          if (!existingUuids.has(anim.uuid)) {
            animations.push(anim);
          }
        });
      }

      const loadedModel: LoadedModel = {
        scene,
        animations: animations.length > 0 ? animations : [],
      };

      setModel(loadedModel);
      updateProgress('Complete', 1);
      onLoadRef.current?.(loadedModel);

    } catch (err) {
      const originalError = err instanceof Error ? err : new Error('Unknown loading error');
      const modelError = handleModelError(originalError, { url });
      setError(modelError);
      setLoadState(prev => ({ ...prev, phase: 'error', currentPhase: modelError.message }));
      onErrorRef.current?.(modelError);
    }
  }, [url, opts.enableDraco, updateProgress]);

  const cancelLoad = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (loaderRef.current) {
      // Cancel any ongoing loads
    }
  }, []);

  useEffect(() => {
    if (url) {
      loadProgressive();
    }

    return () => {
      cancelLoad();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]); // Only depend on url to avoid infinite loops

  return {
    model,
    loadState,
    error,
    cancelLoad,
    reload: loadProgressive,
  };
}
