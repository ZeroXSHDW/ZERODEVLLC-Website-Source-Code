"use client";

import { OrbitControls } from "@react-three/drei";
import { forwardRef, memo } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { CONTROLS_CONFIG } from "@/config/three";
import { useDeviceState } from "@/lib/hooks/useDeviceState";

interface ControlsProps {
  enabled?: boolean;
  autoRotate?: boolean;
  performanceMode?: boolean;
}

const ControlsComponent = forwardRef<OrbitControlsImpl, ControlsProps>(
  function Controls(
    { enabled = true, autoRotate = false, performanceMode = false },
    ref,
  ) {
    const { deviceState } = useDeviceState();
    const isMobile = deviceState.isMobile;

    if (!enabled) {
      return null;
    }

    return (
      <OrbitControls
        ref={ref}
        enablePan={CONTROLS_CONFIG.enablePan}
        enableZoom={CONTROLS_CONFIG.enableZoom}
        enableRotate={CONTROLS_CONFIG.enableRotate}
        maxDistance={CONTROLS_CONFIG.maxDistance}
        minDistance={CONTROLS_CONFIG.minDistance}
        maxPolarAngle={isMobile ? Math.PI : CONTROLS_CONFIG.maxPolarAngle}
        autoRotate={autoRotate}
        autoRotateSpeed={
          performanceMode
            ? CONTROLS_CONFIG.autoRotateSpeed * 0.5
            : CONTROLS_CONFIG.autoRotateSpeed
        }
        dampingFactor={performanceMode ? 0.01 : isMobile ? 0.1 : 0.05} // Reduce damping in performance mode
        enableDamping={!performanceMode} // Disable damping in performance mode
        // Enhanced touch controls for mobile
        touches={{
          ONE: THREE.TOUCH.ROTATE, // Single finger rotate
          TWO: THREE.TOUCH.DOLLY_PAN, // Two fingers zoom and pan
        }}
        // Better mobile sensitivity - reduced in performance mode
        rotateSpeed={performanceMode ? 0.6 : isMobile ? 0.8 : 1.0}
        zoomSpeed={performanceMode ? 0.8 : isMobile ? 0.6 : 1.2}
        panSpeed={performanceMode ? 0.6 : isMobile ? 0.8 : 1.0}
        // Mobile-specific settings
        screenSpacePanning={false} // Better for mobile touch
        minPolarAngle={0} // Allow full vertical rotation on mobile
      />
    );
  },
);

// Memoize Controls to prevent unnecessary re-renders
export const Controls = memo(ControlsComponent, (prevProps, nextProps) => {
  return (
    prevProps.enabled === nextProps.enabled &&
    prevProps.autoRotate === nextProps.autoRotate &&
    prevProps.performanceMode === nextProps.performanceMode
  );
});
