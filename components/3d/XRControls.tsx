"use client";

import { useState, useEffect } from 'react';
import { log } from '@/lib/utils/logger';

interface XRControlsProps {
  mode: 'none' | 'ar' | 'vr';
  onModeChange: (mode: 'none' | 'ar' | 'vr') => void;
}

export function XRControls({ mode, onModeChange }: XRControlsProps) {
  const [isSupported, setIsSupported] = useState<{
    ar: boolean;
    vr: boolean;
  }>({ ar: false, vr: false });

  useEffect(() => {
    // Check for WebXR support
    const checkXRSupport = async () => {
      if (!navigator.xr) {
        setIsSupported({ ar: false, vr: false });
        return;
      }

      try {
        const arSupported = await navigator.xr.isSessionSupported('immersive-ar');
        const vrSupported = await navigator.xr.isSessionSupported('immersive-vr');
        setIsSupported({ ar: arSupported, vr: vrSupported });
      } catch (error) {
        log.warn('WebXR support check failed:', error);
        setIsSupported({ ar: false, vr: false });
      }
    };

    checkXRSupport();
  }, []);

  const handleARClick = async () => {
    if (mode === 'ar') {
      onModeChange('none');
      return;
    }

    if (!navigator.xr) return;

    try {
      const session = await navigator.xr.requestSession('immersive-ar');
      // Note: In a full implementation, you would integrate this session
      // with Three.js WebGLRenderer and handle the XR camera/viewport
      log.info('AR session started:', session);
      onModeChange('ar');
    } catch (error) {
      log.error('Failed to start AR session:', error);
    }
  };

  const handleVRClick = async () => {
    if (mode === 'vr') {
      onModeChange('none');
      return;
    }

    if (!navigator.xr) return;

    try {
      const session = await navigator.xr.requestSession('immersive-vr');
      // Note: In a full implementation, you would integrate this session
      // with Three.js WebGLRenderer and handle the XR camera/viewport
      log.info('VR session started:', session);
      onModeChange('vr');
    } catch (error) {
      log.error('Failed to start VR session:', error);
    }
  };

  return (
    <>
      {/* VR Button */}
      {isSupported.vr && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: mode === 'vr' ? '120px' : '20px',
            zIndex: 1000,
          }}
        >
          <button
            onClick={handleVRClick}
            style={{
              background: mode === 'vr' ? '#ef4444' : '#10b981',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            {mode === 'vr' ? 'Exit VR' : 'Enter VR'}
          </button>
        </div>
      )}

      {/* AR Button */}
      {isSupported.ar && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: isSupported.vr ? '240px' : '120px',
            zIndex: 1000,
          }}
        >
          <button
            onClick={handleARClick}
            style={{
              background: mode === 'ar' ? '#ef4444' : '#3b82f6',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            {mode === 'ar' ? 'Exit AR' : 'Enter AR'}
          </button>
        </div>
      )}
    </>
  );
}

// Export support check utility
export async function checkXRSupport(): Promise<{ ar: boolean; vr: boolean }> {
  if (!navigator.xr) {
    return { ar: false, vr: false };
  }

  try {
    const [arSupported, vrSupported] = await Promise.all([
      navigator.xr.isSessionSupported('immersive-ar'),
      navigator.xr.isSessionSupported('immersive-vr'),
    ]);

    return { ar: arSupported, vr: vrSupported };
  } catch (error) {
    console.warn('WebXR support check failed:', error);
    return { ar: false, vr: false };
  }
}
