"use client";

import { memo, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface PostProcessingProps {
  toneMappingEnabled?: boolean;
  toneMappingExposure?: number;
}

export const PostProcessing = memo(function PostProcessing({
  toneMappingEnabled = true,
  toneMappingExposure = 1.0,
}: PostProcessingProps = {}) {
  const { gl } = useThree();

  useEffect(() => {
    if (!gl) return;

    // Enable tone mapping
    if (toneMappingEnabled) {
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = toneMappingExposure;
    } else {
      gl.toneMapping = THREE.NoToneMapping;
    }

    // Enable output color space (only set if changed)
    if (gl.outputColorSpace !== THREE.SRGBColorSpace) {
      gl.outputColorSpace = THREE.SRGBColorSpace;
    }

    // Don't force render - let React Three Fiber handle rendering
    // This prevents unnecessary renders and improves performance
  }, [gl, toneMappingEnabled, toneMappingExposure]);

  // For now, we'll implement a simple glow effect using emissive materials
  // More advanced post-processing would require additional libraries
  // This provides basic visual enhancement without complex dependencies

  return null; // Post-processing handled via WebGL context
});
