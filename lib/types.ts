/**
 * TypeScript type definitions for the 3D viewer application
 */

// Three.js related types
export type Vector3Array = [number, number, number];

export interface CameraConfig {
  position: Vector3Array;
  fov: number;
  near?: number;
  far?: number;
}

export interface LightingSetup {
  ambient: {
    intensity: number;
  };
  directional: {
    primary: {
      position: Vector3Array;
      intensity: number;
      castShadow?: boolean;
    };
    secondary: {
      position: Vector3Array;
      intensity: number;
    };
  };
  point: {
    position: Vector3Array;
    intensity: number;
  };
}

export interface ControlsConfig {
  enablePan: boolean;
  enableZoom: boolean;
  enableRotate: boolean;
  maxDistance: number;
  minDistance: number;
  maxPolarAngle: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
}

export interface ModelConfig {
  scale: number;
  autoRotateSpeed: number;
  path: string;
}

export interface CanvasConfig {
  shadows: boolean;
  alpha: boolean;
  antialias: boolean;
  powerPreference: 'default' | 'high-performance' | 'low-power';
}

// Component props types
export interface GLBViewerProps {
  modelPath?: string;
  className?: string;
  enableControls?: boolean;
  autoRotate?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLoad?: (scene?: any) => void; // Three.js scene object
  onError?: (error: Error) => void;
}

export interface ControlsPanelProps {
  isOpen: boolean;
  onToggleAction: () => void;
  onCameraPreset?: (
    preset:
      | 'front'
      | 'back'
      | 'left'
      | 'right'
      | 'top'
      | 'bottom'
      | 'isometric'
      | 'isometric_back'
      | 'angle_45'
      | 'side_angle'
      | 'close_front'
      | 'close_top'
      | 'wide_front'
      | 'overview'
  ) => void;
  onLightingChange?: (lighting: { ambient?: number; directional?: number; point?: number }) => void;
  onModelSettingsChange?: (settings: { scale?: number; rotationSpeed?: number }) => void;
  onEnvironmentChange?: (environment: {
    preset?:
      | 'sunset'
      | 'dawn'
      | 'night'
      | 'warehouse'
      | 'forest'
      | 'apartment'
      | 'studio'
      | 'city'
      | 'park'
      | 'lobby';
    intensity?: number;
    enabled?: boolean;
  }) => void;
  onPostProcessingChange?: (postProcessing: {
    toneMapping?: { enabled?: boolean; exposure?: number };
  }) => void;
  onLodChange?: (lod: { enabled?: boolean; quality?: 'auto' | 'high' | 'medium' | 'low' }) => void;
  onResetView?: () => void;
  onToggleRotation?: () => void;
  onPerformanceToggle?: () => void;
  onFileUpload?: (file: File) => void;
  onAnimationPlay?: () => void;
  onAnimationPause?: () => void;
  onAnimationSelect?: (animationName: string) => void;
  onScreenshot?: () => void;
  currentSettings?: import('./types/3d').ViewerSettings & {
    animations?: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      available?: any[]; // Three.js animation objects
      current?: string | null;
      isPlaying?: boolean;
    };
  };
}

export interface ModelProps {
  url: string;
  scale?: number;
  autoRotateSpeed?: number;
  lodEnabled?: boolean;
  lodQuality?: 'auto' | 'high' | 'medium' | 'low';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLoad?: (scene?: any) => void; // Three.js scene object
  onProgress?: (progress: number) => void;
  onError?: (error: Error | import('./types/3d').ModelError) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAnimationsLoaded?: (animations: any[], actions: any) => void; // Three.js animations and actions
}

export interface LoadingFallbackProps {
  message?: string;
  progress?: number;
}

export interface ErrorFallbackProps {
  error?: Error | import('./types/3d').ModelError;
  onRetry?: () => void;
}

// Hook types
export interface UseModelLoaderReturn {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scene: any; // Three.js scene objects can be various types
  loading: boolean;
  error: Error | null;
  progress: number;
}

export interface UseWebGLSupportReturn {
  isSupported: boolean;
  isAvailable: boolean;
  error?: string;
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'loaded' | 'error';

export interface ModelInfo {
  id: string;
  name: string;
  path: string;
  scale?: number;
  description?: string;
  category?: string;
}

export interface LODLevel {
  distance: number;
  quality: 'low' | 'medium' | 'high';
  maxTriangles?: number;
  textureSize?: number;
}
