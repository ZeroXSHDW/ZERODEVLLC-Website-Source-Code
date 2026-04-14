/**
 * Custom hook for WebGL support detection
 */

import { useState, useEffect } from 'react';
import { detectWebGLSupport } from '../utils/webgl';

export function useWebGL() {
  const [webglSupport, setWebglSupport] = useState<{
    isSupported: boolean;
    isAvailable: boolean;
    error?: string;
  }>({
    isSupported: false,
    isAvailable: false,
  });

  useEffect(() => {
    const support = detectWebGLSupport();
    setWebglSupport(support);
  }, []);

  return webglSupport;
}
