/**
 * Hook for automatic error recovery
 */

import { useEffect, useCallback } from 'react';
import { errorRecoveryManager } from '@/lib/utils/errorRecovery';
import type { ModelError } from '@/lib/types/3d';

interface UseErrorRecoveryOptions {
  enabled?: boolean;
  onRecoverySuccess?: () => void;
  onRecoveryFailure?: (error: ModelError) => void;
}

/**
 * Automatically attempts to recover from errors
 */
export function useErrorRecovery(
  error: ModelError | null,
  options: UseErrorRecoveryOptions = {}
) {
  const {
    enabled = true,
    onRecoverySuccess,
    onRecoveryFailure,
  } = options;

  const attemptRecovery = useCallback(async (err: ModelError) => {
    if (!enabled) return;

    const recovered = await errorRecoveryManager.attemptRecovery(err);
    
    if (recovered) {
      onRecoverySuccess?.();
    } else {
      onRecoveryFailure?.(err);
    }
  }, [enabled, onRecoverySuccess, onRecoveryFailure]);

  useEffect(() => {
    if (error && error.recoverable) {
      // Delay recovery slightly to allow UI to update
      const timeoutId = setTimeout(() => {
        attemptRecovery(error);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [error, attemptRecovery]);

  return {
    attemptRecovery,
    recoveryHistory: errorRecoveryManager.getHistory(),
  };
}

