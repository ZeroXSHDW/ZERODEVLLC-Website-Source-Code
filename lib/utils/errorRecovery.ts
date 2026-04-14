/**
 * Enhanced Error Recovery System
 * Provides automatic recovery strategies for various error types
 */

import { log } from './logger';
import type { ModelError } from '@/lib/types/3d';

export interface RecoveryStrategy {
  canRecover: (error: ModelError) => boolean;
  recover: (error: ModelError) => Promise<void>;
  priority: number; // Higher priority = tried first
}

export class ErrorRecoveryManager {
  private strategies: RecoveryStrategy[] = [];
  private recoveryHistory: Array<{ error: ModelError; strategy: string; success: boolean; timestamp: number }> = [];

  /**
   * Register a recovery strategy
   */
  registerStrategy(strategy: RecoveryStrategy): void {
    this.strategies.push(strategy);
    // Sort by priority (highest first)
    this.strategies.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Attempt to recover from an error
   */
  async attemptRecovery(error: ModelError): Promise<boolean> {
    log.info('Attempting error recovery:', { type: error.type, message: error.message });

    for (const strategy of this.strategies) {
      if (strategy.canRecover(error)) {
        try {
          await strategy.recover(error);
          this.recoveryHistory.push({
            error,
            strategy: strategy.constructor.name,
            success: true,
            timestamp: Date.now(),
          });
          log.info('Recovery successful:', { strategy: strategy.constructor.name });
          return true;
        } catch (recoveryError) {
          this.recoveryHistory.push({
            error,
            strategy: strategy.constructor.name,
            success: false,
            timestamp: Date.now(),
          });
          log.warn('Recovery failed:', { strategy: strategy.constructor.name, error: recoveryError });
          // Continue to next strategy
        }
      }
    }

    log.warn('No recovery strategy succeeded for error:', { type: error.type });
    return false;
  }

  /**
   * Get recovery history
   */
  getHistory(): typeof this.recoveryHistory {
    return [...this.recoveryHistory];
  }

  /**
   * Clear recovery history
   */
  clearHistory(): void {
    this.recoveryHistory = [];
  }
}

// Built-in recovery strategies

/**
 * Network error recovery - retry with exponential backoff
 */
export const networkRecoveryStrategy: RecoveryStrategy = {
  canRecover: (error) => error.type === 'network' && error.recoverable,
  priority: 10,
  recover: async (_error) => {
    // Wait before retry
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Trigger page reload or model reload
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  },
};

/**
 * Memory error recovery - clear caches and reduce quality
 */
export const memoryRecoveryStrategy: RecoveryStrategy = {
  canRecover: (error) => error.type === 'memory',
  priority: 9,
  recover: async () => {
    // Clear all caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }

    // Clear localStorage
    localStorage.clear();

    // Force garbage collection if available
    if ('gc' in window && typeof (window as { gc?: () => void }).gc === 'function') {
      (window as { gc?: () => void }).gc?.();
    }

    log.info('Memory recovery: Cleared caches and storage');
  },
};

/**
 * Context loss recovery - reinitialize WebGL
 */
export const contextLossRecoveryStrategy: RecoveryStrategy = {
  canRecover: (error) => error.type === 'render' && error.message.includes('context'),
  priority: 8,
  recover: async () => {
    // The context loss handler should handle this, but we can trigger a reload
    if (typeof window !== 'undefined') {
      // Wait a bit before reload
      await new Promise(resolve => setTimeout(resolve, 2000));
      window.location.reload();
    }
  },
};

// Singleton instance
export const errorRecoveryManager = new ErrorRecoveryManager();

// Register built-in strategies
errorRecoveryManager.registerStrategy(networkRecoveryStrategy);
errorRecoveryManager.registerStrategy(memoryRecoveryStrategy);
errorRecoveryManager.registerStrategy(contextLossRecoveryStrategy);

