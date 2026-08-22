/**
 * Hook for handling WebGL context loss and recovery
 */

import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { log } from "@/lib/utils/logger";

interface ContextLossState {
  lost: boolean;
  restored: boolean;
  lossCount: number;
}

/**
 * Monitors and handles WebGL context loss
 */
export function useWebGLContextLoss() {
  const { gl } = useThree();
  const [state, setState] = useState<ContextLossState>({
    lost: false,
    restored: false,
    lossCount: 0,
  });
  const lossCountRef = useRef(0);

  useEffect(() => {
    const canvas = gl.domElement;
    const webglContext = gl.getContext() as
      | WebGLRenderingContext
      | WebGL2RenderingContext;

    if (!webglContext) return;

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      lossCountRef.current++;

      log.warn("WebGL context lost. Attempting recovery...", {
        lossCount: lossCountRef.current,
      });

      setState({
        lost: true,
        restored: false,
        lossCount: lossCountRef.current,
      });

      // Clear all WebGL resources
      gl.dispose();
    };

    const handleContextRestored = () => {
      log.info("WebGL context restored", {
        lossCount: lossCountRef.current,
      });

      setState({
        lost: false,
        restored: true,
        lossCount: lossCountRef.current,
      });

      // Reinitialize renderer
      gl.setSize(gl.domElement.width, gl.domElement.height);
    };

    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
    };
  }, [gl]);

  return state;
}
