import { useCallback } from 'react';

interface HapticOptions {
  pattern?: number[];
  duration?: number;
  intensity?: 'light' | 'medium' | 'heavy';
}

export function useHapticFeedback() {
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  const vibrate = useCallback((pattern: number | number[]) => {
    if (isSupported) {
      navigator.vibrate(pattern);
    }
  }, [isSupported]);

  const lightTap = useCallback(() => {
    vibrate(10);
  }, [vibrate]);

  const mediumTap = useCallback(() => {
    vibrate(20);
  }, [vibrate]);

  const heavyTap = useCallback(() => {
    vibrate([10, 10, 10]);
  }, [vibrate]);

  const success = useCallback(() => {
    vibrate([20, 10, 20]);
  }, [vibrate]);

  const error = useCallback(() => {
    vibrate([50, 50, 50, 50, 50]);
  }, [vibrate]);

  const custom = useCallback((options: HapticOptions) => {
    if (options.pattern) {
      vibrate(options.pattern);
    } else if (options.duration) {
      vibrate(options.duration);
    }
  }, [vibrate]);

  return {
    isSupported,
    lightTap,
    mediumTap,
    heavyTap,
    success,
    error,
    custom,
  };
}
