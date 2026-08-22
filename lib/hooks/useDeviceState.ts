/**
 * Custom hook for managing device-specific state
 * Handles mobile detection, XR support, and touch interactions
 */

import { useState, useEffect, useCallback } from "react";

export interface DeviceState {
  isMobile: boolean;
  arSupported: boolean;
  vrSupported: boolean;
  touchStartTime: number | null;
  lastTapTime: number | null;
}

const initialDeviceState: DeviceState = {
  isMobile: false,
  arSupported: false,
  vrSupported: false,
  touchStartTime: null,
  lastTapTime: null,
};

export function useDeviceState() {
  const [deviceState, setDeviceState] =
    useState<DeviceState>(initialDeviceState);

  // Mobile detection
  useEffect(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return;
    }

    const checkMobile = () => {
      try {
        const userAgent = navigator.userAgent;
        const isMobileDevice =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            userAgent,
          );
        const isSmallScreen = window.innerWidth <= 768;
        const isTouchDevice =
          "ontouchstart" in window || navigator.maxTouchPoints > 0;

        const mobile = isMobileDevice || (isSmallScreen && isTouchDevice);
        setDeviceState((prev) => ({ ...prev, isMobile: mobile }));
      } catch {
        setDeviceState((prev) => ({ ...prev, isMobile: false }));
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    window.addEventListener("orientationchange", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("orientationchange", checkMobile);
    };
  }, []);

  // XR support detection
  useEffect(() => {
    const checkXRSupport = async () => {
      if (typeof navigator === "undefined" || !("xr" in navigator)) {
        setDeviceState((prev) => ({
          ...prev,
          arSupported: false,
          vrSupported: false,
        }));
        return;
      }

      try {
        if (navigator.xr) {
          const xr = navigator.xr;
          const arSupported = await xr.isSessionSupported("immersive-ar");
          const vrSupported = await xr.isSessionSupported("immersive-vr");
          setDeviceState((prev) => ({ ...prev, arSupported, vrSupported }));
        } else {
          setDeviceState((prev) => ({
            ...prev,
            arSupported: false,
            vrSupported: false,
          }));
        }
      } catch (error) {
        // Log error for debugging (only in development)
        if (process.env.NODE_ENV === "development") {
          console.warn("XR support check failed:", error);
        }
        setDeviceState((prev) => ({
          ...prev,
          arSupported: false,
          vrSupported: false,
        }));
      }
    };

    checkXRSupport();
  }, []);

  const setTouchStartTime = useCallback((time: number | null) => {
    setDeviceState((prev) => ({ ...prev, touchStartTime: time }));
  }, []);

  const setLastTapTime = useCallback((time: number | null) => {
    setDeviceState((prev) => ({ ...prev, lastTapTime: time }));
  }, []);

  return {
    deviceState,
    setTouchStartTime,
    setLastTapTime,
  };
}
