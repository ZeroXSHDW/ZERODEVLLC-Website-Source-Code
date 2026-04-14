'use client';

import { useEffect, useState } from 'react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import type { ViewerSettings } from '@/lib/types/3d';
import { ThreeCanvas } from './ThreeCanvas';

interface ClientOnlyCanvasProps {
  uploadedFileUrl: string | null;
  modelPath: string;
  viewerSettings: ViewerSettings;
  enableControls: boolean;
  xrMode: 'none' | 'ar' | 'vr';
  modelRef: React.RefObject<THREE.Group>;
  controlsRef: React.RefObject<OrbitControlsImpl>;
  handleModelLoad: (scene: THREE.Group) => void;
  handleModelProgress: (progress: number) => void;
  handleModelError: (error: Error | import('@/lib/types/3d').ModelError) => void;
  handleAnimationsLoaded: (animations: THREE.AnimationClip[], actions: Record<string, THREE.AnimationAction>) => void;
  onQualityChange?: (quality: 'high' | 'medium' | 'low') => void;
}

export function ClientOnlyCanvas(props: ClientOnlyCanvasProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <ThreeCanvas {...props} />;
}
