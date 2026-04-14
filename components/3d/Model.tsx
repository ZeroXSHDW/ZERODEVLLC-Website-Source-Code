'use client';

import { forwardRef, useEffect, useMemo, useRef, useImperativeHandle, memo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAnimations, useGLTF, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { Group } from 'three';
import { MODEL_LOADING_OPTIONS } from '@/config/models';
import { LOD } from './LOD';
import type { ModelProps } from '@/lib/types';
import { log } from '@/lib/utils/logger';

const ModelComponent = forwardRef<Group, ModelProps>(function Model(
  {
    url,
    scale,
    autoRotateSpeed,
    lodEnabled = true,
    lodQuality = 'auto',
    onLoad,
    onProgress,
    onAnimationsLoaded,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onError, // Reserved for future error handling
  },
  ref
) {
  // Create internal ref for the group
  const internalRef = useRef<THREE.Group>(null);

  // Merge forwarded ref with internal ref
  useImperativeHandle(ref, () => internalRef.current as THREE.Group, []);

  // Auto-rotate the model - optimized with early return and ref check
  // Skip frame updates entirely if rotation is disabled
  // Use ref to cache speed value and avoid closure issues
  const autoRotateSpeedRef = useRef(autoRotateSpeed);
  useEffect(() => {
    autoRotateSpeedRef.current = autoRotateSpeed;
  }, [autoRotateSpeed]);

  useFrame((state, delta) => {
    // Early return for better performance
    if (!autoRotateSpeedRef.current || autoRotateSpeedRef.current <= 0) return;

    const model = internalRef.current;
    if (model) {
      // Use direct property access for better performance
      model.rotation.y += delta * autoRotateSpeedRef.current;
    }
  });

  // Use @react-three/drei's useGLTF for better built-in features:
  // - Automatic Suspense support
  // - Built-in caching
  // - Progress tracking via useProgress
  // - Better error handling
  const gltf = useGLTF(url, MODEL_LOADING_OPTIONS.useDraco);
  const scene = gltf.scene;
  const gltfAnimations = useMemo(() => gltf.animations || [], [gltf.animations]);

  // Track loading progress using drei's useProgress hook
  const { progress, active } = useProgress();

  // Report progress to parent component with debouncing to reduce re-renders
  const progressRef = useRef<number>(0);
  useEffect(() => {
    const currentProgress =
      active && progress !== undefined
        ? progress / 100
        : !active && scene
          ? 1
          : progressRef.current;

    // Only update if progress changed significantly (0.5% threshold)
    if (Math.abs(currentProgress - progressRef.current) >= 0.005 || currentProgress === 1) {
      progressRef.current = currentProgress;
      onProgress?.(currentProgress);
    }
  }, [progress, active, scene, onProgress]);

  // Handle model load callback - memoized to prevent duplicate processing
  const processedSceneRef = useRef<THREE.Group | null>(null);
  useEffect(() => {
    if (scene && processedSceneRef.current !== scene) {
      processedSceneRef.current = scene;
      try {
        // Call Model's onLoad callback with the scene
        onLoad?.(scene);
        log.debug('Model loaded successfully:', url);
      } catch (error) {
        log.error('Error processing loaded model:', error);
        onError?.(error instanceof Error ? error : new Error('Model processing error'));
        processedSceneRef.current = null; // Reset on error to allow retry
      }
    }
  }, [scene, url, onLoad, onError]);

  // Handle animations - use internalRef for useAnimations
  const { actions } = useAnimations(gltfAnimations, internalRef);

  // Handle animations separately to avoid unnecessary re-runs
  // Use ref to prevent duplicate calls
  const animationsLoadedRef = useRef(false);
  useEffect(() => {
    if (gltfAnimations && gltfAnimations.length > 0 && actions && !animationsLoadedRef.current) {
      animationsLoadedRef.current = true;
      onAnimationsLoaded?.(gltfAnimations, actions);
    }
  }, [gltfAnimations, actions, onAnimationsLoaded]);

  // Material optimization for performance mode - memoized to prevent duplicate traversals
  const optimizedMaterialsRef = useRef<Set<THREE.Material>>(new Set());
  useEffect(() => {
    if (scene && lodQuality === 'low') {
      // Only optimize materials that haven't been optimized yet
      scene.traverse(child => {
        if (child instanceof THREE.Mesh && child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach(material => {
            // Skip if already optimized
            if (optimizedMaterialsRef.current.has(material)) return;

            if (
              material instanceof THREE.MeshStandardMaterial ||
              material instanceof THREE.MeshPhysicalMaterial
            ) {
              // Reduce material complexity in low quality mode
              material.normalMap = null;
              material.roughnessMap = null;
              material.metalnessMap = null;
              material.aoMap = null;
              material.emissiveMap = null;
              material.envMap = null;

              // Simplify material properties
              material.metalness = Math.max(material.metalness, 0.1);
              material.roughness = Math.min(material.roughness, 0.8);
              material.needsUpdate = true;

              // Mark as optimized
              optimizedMaterialsRef.current.add(material);
            }
          });
        }
      });
    } else if (lodQuality !== 'low') {
      // Reset optimization tracking when quality changes away from low
      optimizedMaterialsRef.current.clear();
    }
  }, [scene, lodQuality]);

  // Cache triangle count calculation to avoid expensive traversal on every render
  // Use ref to cache across renders and only recalculate when scene changes
  // Defer calculation to idle callback for better performance
  const triangleCountRef = useRef<number>(0);
  const sceneUuidRef = useRef<string | null>(null);
  const [triangleCount, setTriangleCount] = useState(0);

  useEffect(() => {
    if (!scene) {
      triangleCountRef.current = 0;
      sceneUuidRef.current = null;
      setTriangleCount(0);
      return;
    }

    // Only recalculate if scene UUID changed
    if (sceneUuidRef.current === scene.uuid) {
      setTriangleCount(triangleCountRef.current);
      return;
    }

    // Defer expensive calculation to idle callback
    const calculateTriangleCount = () => {
      let count = 0;
      scene.traverse(child => {
        if (child instanceof THREE.Mesh && child.geometry) {
          const geometry = child.geometry;
          if (geometry.index) {
            count += geometry.index.count / 3;
          } else if (geometry.attributes.position) {
            count += geometry.attributes.position.count / 3;
          }
        }
      });

      triangleCountRef.current = count;
      sceneUuidRef.current = scene.uuid;
      setTriangleCount(count);
    };

    // Use requestIdleCallback if available, otherwise calculate immediately
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(calculateTriangleCount, { timeout: 1000 });
    } else {
      // Fallback: calculate on next frame
      requestAnimationFrame(calculateTriangleCount);
    }
  }, [scene]);

  // Calculate adaptive LOD levels based on model size and quality settings
  const lodLevels = useMemo(() => {
    if (!scene) return [{ distance: 0, quality: 'high' as const }];

    // Calculate model bounds and complexity
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z);

    // Adaptive LOD based on model size and triangle count
    if (lodQuality === 'auto') {
      const baseDistance = Math.max(5, maxDimension * 2);
      const levels: Array<{
        distance: number;
        quality: 'high' | 'medium' | 'low';
        maxTriangles?: number;
      }> = [{ distance: 0, quality: 'high' }];

      if (triangleCount > 10000) {
        levels.push({
          distance: baseDistance,
          quality: 'medium',
          maxTriangles: Math.floor(triangleCount * 0.5),
        });
      }

      if (triangleCount > 50000) {
        levels.push({
          distance: baseDistance * 3,
          quality: 'low',
          maxTriangles: Math.floor(triangleCount * 0.1),
        });
      }

      return levels;
    }

    if (lodQuality === 'high') {
      return [{ distance: 0, quality: 'high' as const }];
    }

    if (lodQuality === 'medium') {
      return [
        {
          distance: 0,
          quality: 'medium' as const,
          maxTriangles: Math.floor(triangleCount * 0.5),
        },
      ];
    }

    return [
      {
        distance: 0,
        quality: 'low' as const,
        maxTriangles: Math.floor(triangleCount * 0.1),
      },
    ];
  }, [scene, lodQuality, triangleCount]);

  if (!scene) {
    return null; // Don't render until loaded (Suspense handles loading state)
  }

  const modelContent = (
    <group ref={internalRef} scale={scale}>
      <primitive
        object={scene}
        receiveShadow={MODEL_LOADING_OPTIONS.receiveShadow}
        castShadow={MODEL_LOADING_OPTIONS.castShadow}
      />
    </group>
  );

  return lodEnabled ? <LOD levels={lodLevels}>{modelContent}</LOD> : modelContent;
});

// Memoize Model component with custom comparison to prevent unnecessary re-renders
export const Model = memo(ModelComponent, (prevProps, nextProps) => {
  return (
    prevProps.url === nextProps.url &&
    prevProps.scale === nextProps.scale &&
    prevProps.autoRotateSpeed === nextProps.autoRotateSpeed &&
    prevProps.lodEnabled === nextProps.lodEnabled &&
    prevProps.lodQuality === nextProps.lodQuality
    // Callbacks are stable (memoized in parent), so we don't need to compare them
  );
}) as typeof ModelComponent;
