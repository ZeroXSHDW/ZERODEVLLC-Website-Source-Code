/**
 * Model configuration and paths
 */

export interface ModelInfo {
  id: string;
  name: string;
  path: string;
  scale?: number;
  description?: string;
  category?: string;
}

export const AVAILABLE_MODELS: ModelInfo[] = [
  {
    id: 'default',
    name: 'Default Model',
    path: '/model.glb',
    scale: 2.3,
    description: 'Main 3D model for the viewer',
    category: 'featured',
  },
];

export const MODEL_LOADING_OPTIONS = {
  useDraco: 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/', // Use GStatic CDN for reliable browser decoders
  useMeshopt: true,
  receiveShadow: true,
  castShadow: true,
} as const;

export const DEFAULT_MODEL = AVAILABLE_MODELS[0];
