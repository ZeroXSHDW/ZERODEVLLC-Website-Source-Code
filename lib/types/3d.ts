import * as THREE from 'three';

// Core 3D Types
export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface Transform {
  position: Vector3D;
  rotation: Vector3D;
  scale: Vector3D;
}

// Model Loading Types
export interface ModelLoadOptions {
  enableDraco?: boolean;
  enableTextures?: boolean;
  maxTextureSize?: number;
  generateMipmaps?: boolean;
  onProgress?: (progress: number) => void;
  onLoad?: (scene: THREE.Group) => void;
  onError?: (error: Error) => void;
}

export interface ModelLoadState {
  loading: boolean;
  progress: number;
  error: Error | null;
  scene: THREE.Group | null;
}

// Performance Types
export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage?: number;
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
}

export interface PerformanceSettings {
  mode: 'normal' | 'performance';
  targetFps: number;
  maxMemoryUsage?: number;
  enableInstancing: boolean;
  enableLOD: boolean;
  enableFrustumCulling: boolean;
}

// Viewer Settings Types
export interface ViewerSettings {
  autoRotate: boolean;
  rotationSpeed: number;
  scale: number;
  lighting: {
    ambient: number;
    directional: number;
    point: number;
  };
  environment: {
    preset: 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'city' | 'park' | 'lobby';
    intensity: number;
    enabled: boolean;
  };
  postProcessing: {
    toneMapping: {
      enabled: boolean;
      exposure: number;
    };
  };
  performanceMode: boolean;
  lod: {
    enabled: boolean;
    quality: 'auto' | 'high' | 'medium' | 'low';
  };
}

// Component Props Types
export interface ModelProps {
  url: string;
  scale?: number;
  autoRotateSpeed?: number;
  lodEnabled?: boolean;
  lodQuality?: 'auto' | 'high' | 'medium' | 'low';
  onLoad?: (scene: THREE.Group) => void;
  onProgress?: (progress: number) => void;
  onError?: (error: Error) => void;
  onAnimationsLoaded?: (animations: THREE.AnimationClip[], actions: Record<string, THREE.AnimationAction>) => void;
}

export interface ControlsProps {
  enabled?: boolean;
  autoRotate?: boolean;
  performanceMode?: boolean;
}

export interface LightingProps {
  ambientIntensity?: number;
  directionalIntensity?: number;
  pointIntensity?: number;
}

export interface EnvironmentProps {
  preset?: 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'city' | 'park' | 'lobby';
  enabled?: boolean;
  intensity?: number;
}

export interface PostProcessingProps {
  toneMappingEnabled?: boolean;
  toneMappingExposure?: number;
}

// Canvas and Rendering Types
export interface CanvasConfig {
  shadows: boolean;
  alpha: boolean;
  antialias: boolean;
  powerPreference: 'default' | 'high-performance' | 'low-power';
  stencil: boolean;
  depth: boolean;
  logarithmicDepthBuffer: boolean;
}

export interface RenderSettings {
  frameloop: 'always' | 'demand' | 'never';
  dpr: number;
  camera: {
    fov: number;
    near: number;
    far: number;
    position: Vector3D;
  };
}

// LOD Types
export interface LODLevel {
  distance: number;
  quality: 'high' | 'medium' | 'low';
  maxTriangles?: number;
}

export interface LODSettings {
  levels: LODLevel[];
  hysteresis?: number;
  enabled: boolean;
}

// Geometry Optimization Types
export interface InstancedGeometry {
  geometry: THREE.BufferGeometry;
  matrices: THREE.Matrix4[];
  count: number;
  material: THREE.Material;
}

export interface OptimizationResult {
  instancedGeometries: InstancedGeometry[];
  regularMeshes: THREE.Mesh[];
  originalTriangleCount: number;
  optimizedTriangleCount: number;
  memorySaved: number;
}

// Cache Types
export interface CachedModel {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
  materials: THREE.Material[];
  geometries: THREE.BufferGeometry[];
  textures: THREE.Texture[];
  url: string;
  timestamp: number;
  size: number;
}

export interface CacheStats {
  totalModels: number;
  totalSize: number;
  hitRate: number;
  hits: number;
  misses: number;
}

// Animation Types
export interface AnimationState {
  playing: boolean;
  currentTime: number;
  duration: number;
  loop: boolean;
  speed: number;
}

export interface AnimationControls {
  play: (name?: string) => void;
  pause: () => void;
  stop: () => void;
  setTime: (time: number) => void;
  setSpeed: (speed: number) => void;
  setLoop: (loop: boolean) => void;
}

// Error Types
export interface ModelError {
  type: 'load' | 'parse' | 'render' | 'memory' | 'network';
  message: string;
  originalError?: Error;
  recoverable: boolean;
}

// Event Types
export interface ViewerEvents {
  onLoad?: (scene: THREE.Group) => void;
  onError?: (error: ModelError) => void;
  onProgress?: (progress: number) => void;
  onPerformanceChange?: (metrics: PerformanceMetrics) => void;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type NonNullable<T> = T extends null | undefined ? never : T;
