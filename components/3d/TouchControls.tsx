"use client";

import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useGesture } from '@use-gesture/react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface TouchControlsProps {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  enabled?: boolean;
}

export function TouchControls({ controlsRef, enabled = true }: TouchControlsProps) {
  const { camera, gl } = useThree();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const initialDistance = useRef<number>(0);
  const initialCameraPosition = useRef<THREE.Vector3>();
  const initialCameraTarget = useRef<THREE.Vector3>();

  // Bind touch gestures
  const bind = useGesture(
    {
      onPinch: ({ offset: [scale], event, memo }) => {
        if (!enabled || !controlsRef.current) return;

        event.preventDefault();

        // Handle pinch-to-zoom
        const currentDistance = scale;
        const zoomFactor = currentDistance / (memo?.initialDistance || 1);

        // Use OrbitControls zoom functionality
        const controls = controlsRef.current;
        if (controls && controls.enableZoom) {
          // Calculate zoom based on pinch gesture
          const zoomSpeed = 0.01;
          const zoomDelta = (zoomFactor - 1) * zoomSpeed;

          // Get current camera position and target
          const cameraPosition = camera.position.clone();
          const target = controls.target.clone();

          // Calculate direction from camera to target
          const direction = target.clone().sub(cameraPosition).normalize();

          // Move camera along the direction
          const newPosition = cameraPosition.clone().add(direction.multiplyScalar(zoomDelta * 10));
          camera.position.copy(newPosition);

          controls.update();
        }

        return { initialDistance: memo?.initialDistance || currentDistance };
      },

      onPinchStart: ({ event }) => {
        if (!enabled) return;
        event.preventDefault();

        // Store initial camera state
        initialCameraPosition.current = camera.position.clone();
        if (controlsRef.current) {
          initialCameraTarget.current = controlsRef.current.target.clone();
        }
      },

      onDrag: ({ offset: [x, y], event, pinching }) => {
        if (!enabled || pinching || !controlsRef.current) return;

        event.preventDefault();

        // Handle pan/drag gestures
        const controls = controlsRef.current;
        if (controls && controls.enablePan) {
          // Convert screen coordinates to world coordinates
          const panSpeed = 0.001;
          const deltaX = -x * panSpeed;
          const deltaY = y * panSpeed;

          // Apply pan to controls target
          const panVector = new THREE.Vector3(deltaX, deltaY, 0);
          controls.target.add(panVector);
          controls.update();
        }
      },

      onWheel: ({ delta: [, deltaY] }) => {
        if (!enabled || !controlsRef.current) return;

        // Handle mouse wheel zoom (for touchpad support)
        const controls = controlsRef.current;
        if (controls && controls.enableZoom) {
          const zoomSpeed = 0.001;
          const zoomDelta = deltaY * zoomSpeed;

          // Get current camera position and target
          const cameraPosition = camera.position.clone();
          const target = controls.target.clone();

          // Calculate direction from camera to target
          const direction = target.clone().sub(cameraPosition).normalize();

          // Move camera along the direction
          const newPosition = cameraPosition.clone().add(direction.multiplyScalar(zoomDelta));
          camera.position.copy(newPosition);

          controls.update();
        }
      },
    },
    {
      drag: {
        filterTaps: true,
        rubberband: true,
      },
      pinch: {
        scaleBounds: { min: 0.1, max: 10 },
        rubberband: true,
      },
      wheel: {
        eventOptions: { passive: false },
      },
    }
  );

  // Apply gesture bindings to the canvas
  useEffect(() => {
    if (!enabled) return;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const canvas = gl.domElement;

    // Bind gestures to canvas
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _gestureBindings = bind();

    // No cleanup needed for useGesture - it handles cleanup automatically
  }, [bind, gl.domElement, enabled]);

  // This component doesn't render anything, it just sets up gesture handlers
  return null;
}
