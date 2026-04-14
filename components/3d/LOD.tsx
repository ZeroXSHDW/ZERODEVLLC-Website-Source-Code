'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useLOD, LODLevel } from '@/lib/hooks/useLOD';

interface LODProps {
  children: React.ReactNode;
  levels?: LODLevel[];
  position?: [number, number, number];
  onLODChange?: (level: LODLevel) => void;
}

function applyLODToObject(object: THREE.Object3D, level: LODLevel): void {
  object.traverse(child => {
    if (child instanceof THREE.Mesh) {
      const mesh = child as THREE.Mesh;
      // We don't modify geometry or materials here anymore to avoid corruption and performance issues.
      // Instead, we just handle basic visibility if needed.
      if (level.quality === 'low' && mesh.userData.isExpensive) {
        mesh.visible = false;
      } else {
        mesh.visible = true;
      }
    }
  });
}

export function LOD({ children, levels, position = [0, 0, 0], onLODChange }: LODProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [lastAppliedLevel, setLastAppliedLevel] = useState<LODLevel | null>(null);

  const { currentLOD, targetRef } = useLOD({
    levels: levels || [
      { distance: 0, quality: 'high' },
      { distance: 15, quality: 'medium', maxTriangles: 50000 },
      { distance: 30, quality: 'low', maxTriangles: 10000 },
    ],
  });

  // Set the target for distance calculations
  useMemo(() => {
    if (groupRef.current && targetRef) {
      targetRef.current = groupRef.current;
    }
  }, [targetRef]);

  // Apply LOD changes when level changes
  useEffect(() => {
    if (groupRef.current && currentLOD !== lastAppliedLevel) {
      applyLODToObject(groupRef.current, currentLOD);
      setLastAppliedLevel(currentLOD);
      onLODChange?.(currentLOD);
    }
  }, [currentLOD, lastAppliedLevel, onLODChange]);

  // Note: GeometryCache uses LRU eviction, so no manual cleanup needed
  // The cache will automatically evict oldest entries when it reaches maxSize

  return (
    <group ref={groupRef} position={position}>
      {children}
    </group>
  );
}

// Higher-order component for models with LOD
export function withLOD<P extends object>(
  Component: React.ComponentType<P>,
  lodConfig?: {
    levels?: LODLevel[];
    onLODChange?: (level: LODLevel) => void;
  }
) {
  return function LODWrappedComponent(props: P) {
    return (
      <LOD levels={lodConfig?.levels} onLODChange={lodConfig?.onLODChange}>
        <Component {...props} />
      </LOD>
    );
  };
}
