"use client";

import { useEffect, useState, Suspense } from 'react';
import { Monitor } from 'lucide-react';
import { log } from '@/lib/utils/logger';

interface XRProps {
  children: React.ReactNode;
  mode?: 'none' | 'ar' | 'vr';
}

// Lazy load XR component to prevent SSR issues
function XRWrapper({ children }: { children: React.ReactNode }) {
  const [XR, setXR] = useState<React.ComponentType<{ children: React.ReactNode }> | null>(null);

  useEffect(() => {
    // Only load XR on client side
    if (typeof window !== 'undefined') {
      import('@react-three/xr')
        .then((mod) => {
          setXR(() => mod.XR);
        })
        .catch((error) => {
          log.warn('Failed to load XR component:', error);
        });
    }
  }, []);

  if (!XR) {
    // Return children without XR wrapper if XR not loaded
    return <>{children}</>;
  }

  return <XR>{children}</XR>;
}

export function XRSupport({ children, mode = 'none' }: XRProps) {
  if (mode === 'none') {
    return <>{children}</>;
  }

  // Only wrap with XR when mode is not 'none'
  return (
    <Suspense fallback={<>{children}</>}>
      <XRWrapper>{children}</XRWrapper>
    </Suspense>
  );
}

// XR Control Panel Component for UI overlay
interface XRControlPanelProps {
  arSupported: boolean;
  vrSupported: boolean;
  xrMode: 'none' | 'ar' | 'vr';
}

export function XRControlPanel({
  arSupported,
  vrSupported,
  xrMode
}: XRControlPanelProps) {
  if (!arSupported && !vrSupported) {
    return (
      <div className="fixed bottom-16 right-4 z-30">
        <div className="bg-gray-800 text-gray-400 px-3 py-2 rounded-lg text-sm">
          XR not supported on this device
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-16 right-4 z-30 flex gap-2">
      {arSupported && xrMode === 'none' && (
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg flex items-center gap-2"
          title="Augmented Reality mode"
          onClick={() => {
            // XR mode will be handled by the parent component
            log.debug('AR mode requested - implement XR session handling');
          }}
        >
          <Monitor className="w-4 h-4" />
          AR
        </button>
      )}

      {vrSupported && xrMode === 'none' && (
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg flex items-center gap-2"
          title="Virtual Reality mode"
          onClick={() => {
            // XR mode will be handled by the parent component
            log.debug('VR mode requested - implement XR session handling');
          }}
        >
          <Monitor className="w-4 h-4" />
          VR
        </button>
      )}

      {xrMode !== 'none' && (
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg"
          title="Exit XR Mode"
          onClick={() => {
            // For now, just indicate exit
            log.debug('Exit XR mode');
          }}
        >
          Exit XR
        </button>
      )}
    </div>
  );
}
