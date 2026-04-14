"use client";

import { memo, useMemo } from 'react';
import { LIGHTING_CONFIG } from '@/config/three';

interface LightingProps {
  ambientIntensity?: number;
  directionalIntensity?: number;
  pointIntensity?: number;
  performanceMode?: boolean;
}

export const Lighting = memo(function Lighting({
  ambientIntensity = LIGHTING_CONFIG.ambient.intensity,
  directionalIntensity = LIGHTING_CONFIG.directional.primary.intensity,
  pointIntensity = LIGHTING_CONFIG.point.intensity,
  performanceMode = false,
}: LightingProps = {}) {
  // Adaptive shadow map size based on performance mode
  const shadowMapSize = useMemo(() => performanceMode ? 1024 : 2048, [performanceMode]);

  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={ambientIntensity} />

      {/* Primary directional light */}
      <directionalLight
        position={LIGHTING_CONFIG.directional.primary.position}
        intensity={directionalIntensity}
        castShadow={LIGHTING_CONFIG.directional.primary.castShadow && !performanceMode}
        shadow-mapSize={[shadowMapSize, shadowMapSize]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Secondary directional light */}
      <directionalLight
        position={LIGHTING_CONFIG.directional.secondary.position}
        intensity={directionalIntensity * 0.67}
        castShadow={false}
      />

      {/* Point light for additional highlights */}
      <pointLight
        position={LIGHTING_CONFIG.point.position}
        intensity={pointIntensity}
        castShadow={false}
      />
    </>
  );
});
