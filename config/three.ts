/**
 * Three.js configuration constants
 */

export const CAMERA_CONFIG = {
  position: [0, 0, 1.8] as [number, number, number],
  fov: 50,
  near: 0.1,
  far: 1000,
} as const;

export const CAMERA_PRESETS = {
  // Standard orthographic views
  front: {
    position: [0, 0, 3] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
    description: 'Front view',
  },
  back: {
    position: [0, 0, -3] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
    description: 'Back view',
  },
  left: {
    position: [-3, 0, 0] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
    description: 'Left side view',
  },
  right: {
    position: [3, 0, 0] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
    description: 'Right side view',
  },
  top: {
    position: [0, 3, 0] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
    description: 'Top view',
  },
  bottom: {
    position: [0, -3, 0] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
    description: 'Bottom view',
  },

  // Isometric views
  isometric: {
    position: [2.5, 2.5, 2.5] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
    description: 'Isometric view',
  },
  isometric_back: {
    position: [-2.5, 2.5, -2.5] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
    description: 'Back isometric view',
  },

  // Angular views
  angle_45: {
    position: [2.5, 1.5, 2.5] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
    description: '45° angle view',
  },
  side_angle: {
    position: [3, 1, 1] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
    description: 'Side angle view',
  },

  // Close-up views
  close_front: {
    position: [0, 0, 1.5] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
    description: 'Close front view',
  },
  close_top: {
    position: [0, 1.5, 0] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
    description: 'Close top view',
  },

  // Wide views
  wide_front: {
    position: [0, 0, 5] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
    description: 'Wide front view',
  },
  overview: {
    position: [0, 6, 6] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
    description: 'Overview',
  },
} as const;

export const LIGHTING_CONFIG = {
  ambient: {
    intensity: 0.4,
  },
  directional: {
    primary: {
      position: [5, 5, 5] as [number, number, number],
      intensity: 1.2,
      castShadow: true,
    },
    secondary: {
      position: [-5, 5, -5] as [number, number, number],
      intensity: 0.8,
    },
  },
  point: {
    position: [0, 2, 0] as [number, number, number],
    intensity: 0.5,
  },
} as const;

export const CONTROLS_CONFIG = {
  enablePan: true,
  enableZoom: true,
  enableRotate: true,
  maxDistance: 8,
  minDistance: 0.8,
  maxPolarAngle: Math.PI,
  autoRotate: false,
  autoRotateSpeed: 0.5,
} as const;

export const MODEL_CONFIG = {
  defaultScale: 2.3,
  autoRotateSpeed: 0.3,
  defaultModel: '/model.glb',
} as const;

export const CANVAS_CONFIG = {
  shadows: true,
  alpha: false,
  antialias: true,
  powerPreference: 'high-performance' as const,
} as const;

export const POST_PROCESSING_CONFIG = {
  toneMapping: {
    enabled: true,
    exposure: 1.0,
  },
} as const;
