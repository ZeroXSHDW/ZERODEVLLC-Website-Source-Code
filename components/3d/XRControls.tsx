"use client";

import { useState, useEffect } from "react";
import { log } from "@/lib/utils/logger";

interface XRControlsProps {
  mode: "none" | "ar" | "vr";
  onModeChange: (mode: "none" | "ar" | "vr") => void;
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
        const arSupported =
          await navigator.xr.isSessionSupported("immersive-ar");
        const vrSupported =
          await navigator.xr.isSessionSupported("immersive-vr");
        setIsSupported({ ar: arSupported, vr: vrSupported });
      } catch (error) {
        log.warn("WebXR support check failed:", error);
        setIsSupported({ ar: false, vr: false });
      }
    };

    checkXRSupport();
  }, []);

  const handleARClick = async () => {
    if (mode === "ar") {
      onModeChange("none");
      return;
    }

    if (!navigator.xr) return;

    try {
      const session = await navigator.xr.requestSession("immersive-ar");
      // Note: In a full implementation, you would integrate this session
      // with Three.js WebGLRenderer and handle the XR camera/viewport
      log.info("AR session started:", session);
      onModeChange("ar");
    } catch (error) {
      log.error("Failed to start AR session:", error);
    }
  };

  const handleVRClick = async () => {
    if (mode === "vr") {
      onModeChange("none");
      return;
    }

    if (!navigator.xr) return;

    try {
      const session = await navigator.xr.requestSession("immersive-vr");
      // Note: In a full implementation, you would integrate this session
      // with Three.js WebGLRenderer and handle the XR camera/viewport
      log.info("VR session started:", session);
      onModeChange("vr");
    } catch (error) {
      log.error("Failed to start VR session:", error);
    }
  };

  return (
    <>
      {/* VR Button */}
      {isSupported.vr && (
        <div
          className={`xr-control-shell ${mode === "vr" ? "xr-control-shell-vr-active" : "xr-control-shell-vr"}`}
        >
          <button
            onClick={handleVRClick}
            className={`xr-control-button xr-control-button-vr ${mode === "vr" ? "xr-control-button-active" : ""}`}
          >
            {mode === "vr" ? "Exit VR" : "Enter VR"}
          </button>
        </div>
      )}

      {/* AR Button */}
      {isSupported.ar && (
        <div
          className={`xr-control-shell ${isSupported.vr ? "xr-control-shell-ar-with-vr" : "xr-control-shell-ar"}`}
        >
          <button
            onClick={handleARClick}
            className={`xr-control-button xr-control-button-ar ${mode === "ar" ? "xr-control-button-active" : ""}`}
          >
            {mode === "ar" ? "Exit AR" : "Enter AR"}
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
      navigator.xr.isSessionSupported("immersive-ar"),
      navigator.xr.isSessionSupported("immersive-vr"),
    ]);

    return { ar: arSupported, vr: vrSupported };
  } catch (error) {
    console.warn("WebXR support check failed:", error);
    return { ar: false, vr: false };
  }
}
