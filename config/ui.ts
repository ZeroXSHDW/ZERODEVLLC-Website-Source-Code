/**
 * UI configuration constants
 */

export const THEME = {
  colors: {
    background: '#000000',
    surface: '#111111',
    primary: '#ffffff',
    secondary: '#888888',
    accent: '#00ff88',
    error: '#ff4444',
  },
  fonts: {
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Inconsolata, "Roboto Mono", monospace',
    sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
} as const;

export const LOADING_MESSAGES = [
  'Loading GLB Environment...',
  'Initializing 3D Scene...',
  'Setting up Lighting...',
  'Preparing Model...',
] as const;

export const ERROR_MESSAGES = {
  WEBGL_NOT_SUPPORTED: 'WebGL is not supported in your browser. Please update your browser or enable WebGL.',
  MODEL_LOAD_FAILED: 'Failed to load 3D model. Please check your connection and try again.',
  GENERIC_ERROR: 'An unexpected error occurred. Please refresh the page.',
} as const;

export const ANIMATION_CONFIG = {
  loading: {
    duration: 2000,
    ease: 'easeInOut',
  },
  modelRotation: {
    speed: 0.3,
    enabled: true,
  },
} as const;
