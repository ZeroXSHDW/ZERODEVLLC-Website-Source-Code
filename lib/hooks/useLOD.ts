import { useMemo, useState, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export interface LODLevel {
  distance: number;
  quality: "low" | "medium" | "high";
  maxTriangles?: number;
  textureSize?: number;
}

export interface LODConfig {
  levels: LODLevel[];
  hysteresis?: number; // Prevent rapid switching
  updateInterval?: number; // How often to check distance (ms)
}

const DEFAULT_LOD_CONFIG: LODConfig = {
  levels: [
    { distance: 0, quality: "high" },
    { distance: 10, quality: "medium", maxTriangles: 50000 },
    { distance: 25, quality: "low", maxTriangles: 10000 },
  ],
  hysteresis: 1.0,
  updateInterval: 100,
};

export function useLOD(config: LODConfig = DEFAULT_LOD_CONFIG) {
  const { camera } = useThree();
  const [currentLevel, setCurrentLevel] = useState(0);
  const lastCheckTime = useRef(0);
  const targetRef = useRef<THREE.Object3D | null>(null);

  const mergedConfig = useMemo(
    () => ({
      ...DEFAULT_LOD_CONFIG,
      ...config,
    }),
    [config],
  );

  // Calculate distance to target
  const calculateDistance = () => {
    if (!targetRef.current) return 0;
    return camera.position.distanceTo(targetRef.current.position);
  };

  // Determine appropriate LOD level based on distance
  const getLODLevel = (distance: number): number => {
    for (let i = mergedConfig.levels.length - 1; i >= 0; i--) {
      if (
        distance >=
        mergedConfig.levels[i].distance - (mergedConfig.hysteresis || 0)
      ) {
        return i;
      }
    }
    return 0;
  };

  // Update LOD level based on camera distance (throttled for performance)
  useFrame(() => {
    const now = Date.now();
    const updateInterval = mergedConfig.updateInterval || 100;

    // Skip if not enough time has passed
    if (now - lastCheckTime.current < updateInterval) {
      return;
    }

    lastCheckTime.current = now;
    const distance = calculateDistance();
    const newLevel = getLODLevel(distance);

    // Only update state if level actually changed (prevents unnecessary re-renders)
    if (newLevel !== currentLevel) {
      setCurrentLevel(newLevel);
    }
  });

  const currentLOD = mergedConfig.levels[currentLevel];
  const nextLOD =
    currentLevel < mergedConfig.levels.length - 1
      ? mergedConfig.levels[currentLevel + 1]
      : null;

  return {
    currentLevel,
    currentLOD,
    nextLOD,
    distance: calculateDistance(),
    targetRef,
    config: mergedConfig,
  };
}

// LOD Manager for coordinating multiple LOD objects
export class LODManager {
  private lods: Map<string, { object: THREE.Object3D; levels: LODLevel[] }> =
    new Map();
  private camera: THREE.Camera;

  constructor(camera: THREE.Camera) {
    this.camera = camera;
  }

  register(id: string, object: THREE.Object3D, levels: LODLevel[]) {
    this.lods.set(id, { object, levels });
  }

  unregister(id: string) {
    this.lods.delete(id);
  }

  update() {
    this.lods.forEach(({ object, levels }) => {
      const distance = this.camera.position.distanceTo(object.position);

      const appropriateLevel = this.getAppropriateLevel(distance, levels);

      // Here you would apply the appropriate level to the object
      // For example: object.visible = appropriateLevel.quality !== 'hidden';
      // or apply different materials/geometry based on level
    });
  }

  private getAppropriateLevel(distance: number, levels: LODLevel[]): LODLevel {
    for (let i = levels.length - 1; i >= 0; i--) {
      if (distance >= levels[i].distance) {
        return levels[i];
      }
    }
    return levels[0];
  }
}
