import type { ModelError } from '@/lib/types/3d';

export interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  retryCondition?: (error: Error) => boolean;
}

export interface CircuitBreakerOptions {
  failureThreshold: number;
  recoveryTimeout: number;
  monitoringPeriod: number;
}

export class ErrorHandler {
  private static circuitBreakers = new Map<string, CircuitBreaker>();

  /**
   * Classifies errors and determines if they're recoverable
   */
  static classifyError(error: Error): ModelError {
    const message = error.message.toLowerCase();

    // Network errors
    if (message.includes('network') || message.includes('fetch') || message.includes('404') || message.includes('500')) {
      return {
        type: 'network',
        message: 'Network error while loading model. Please check your connection.',
        originalError: error,
        recoverable: true,
      };
    }

    // Memory errors
    if (message.includes('memory') || message.includes('out of memory') || message.includes('allocation failed')) {
      return {
        type: 'memory',
        message: 'Not enough memory to load this model. Try a simpler model or free up system memory.',
        originalError: error,
        recoverable: false,
      };
    }

    // Parse errors
    if (message.includes('parse') || message.includes('invalid') || message.includes('corrupt') || message.includes('malformed')) {
      return {
        type: 'parse',
        message: 'Model file appears to be corrupted or in an unsupported format.',
        originalError: error,
        recoverable: false,
      };
    }

    // Load errors
    if (message.includes('load') || message.includes('timeout') || message.includes('abort')) {
      return {
        type: 'load',
        message: 'Failed to load model file. The file may be missing or inaccessible.',
        originalError: error,
        recoverable: true,
      };
    }

    // Render errors
    if (message.includes('render') || message.includes('webgl') || message.includes('shader') || message.includes('context')) {
      return {
        type: 'render',
        message: 'Rendering error. Your graphics card may not support this feature.',
        originalError: error,
        recoverable: false,
      };
    }

    // Generic error
    return {
      type: 'load',
      message: 'An unexpected error occurred while loading the model.',
      originalError: error,
      recoverable: true,
    };
  }

  /**
   * Retries an operation with exponential backoff
   */
  static async withRetry<T>(
    operation: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const {
      maxRetries = 3,
      baseDelay = 1000,
      maxDelay = 10000,
      backoffFactor = 2,
      retryCondition = () => true,
    } = options;

    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Don't retry if condition fails or this is the last attempt
        if (!retryCondition(lastError) || attempt === maxRetries) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(baseDelay * Math.pow(backoffFactor, attempt), maxDelay);

        // Use logger instead of console.warn (will be imported where needed)
        if (typeof window !== 'undefined') {
          // eslint-disable-next-line no-console
          console.warn(`Operation failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms:`, lastError.message);
        }

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  /**
   * Circuit breaker pattern to prevent cascading failures
   */
  static async withCircuitBreaker<T>(
    key: string,
    operation: () => Promise<T>,
    options: CircuitBreakerOptions = {
      failureThreshold: 5,
      recoveryTimeout: 60000,
      monitoringPeriod: 10000,
    }
  ): Promise<T> {
    let breaker = this.circuitBreakers.get(key);

    if (!breaker) {
      breaker = new CircuitBreaker(options);
      this.circuitBreakers.set(key, breaker);
    }

    return breaker.execute(operation);
  }

  /**
   * Handles model loading errors with appropriate user feedback
   */
  static getErrorMessage(error: ModelError): {
    title: string;
    message: string;
    action?: string;
    retryable: boolean;
  } {
    switch (error.type) {
      case 'network':
        return {
          title: 'Connection Error',
          message: 'Unable to download the model. Please check your internet connection and try again.',
          action: 'Retry',
          retryable: true,
        };

      case 'memory':
        return {
          title: 'Memory Error',
          message: 'Your device doesn\'t have enough memory to load this model. Try closing other applications or use a simpler model.',
          action: 'Close other apps',
          retryable: false,
        };

      case 'parse':
        return {
          title: 'Invalid File',
          message: 'The model file appears to be corrupted or in an unsupported format. Please check the file and try again.',
          action: 'Choose different file',
          retryable: false,
        };

      case 'render':
        return {
          title: 'Graphics Error',
          message: 'Your graphics card doesn\'t support this feature. Try updating your drivers or using a different device.',
          action: 'Update drivers',
          retryable: false,
        };

      default:
        return {
          title: 'Loading Error',
          message: 'An unexpected error occurred while loading the model. Please try again.',
          action: 'Retry',
          retryable: error.recoverable,
        };
    }
  }

  /**
   * Logs errors with appropriate levels and context
   */
  static logError(error: ModelError, context?: Record<string, unknown>): void {
    const logData = {
      type: error.type,
      message: error.message,
      recoverable: error.recoverable,
      context,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    };

    // Use logger instead of console
    if (typeof window !== 'undefined') {
      // Dynamic import to avoid circular dependencies
      import('@/lib/utils/logger').then(({ log }) => {
        if (error.type === 'memory' || error.type === 'render') {
          log.error('Critical model error:', logData);
        } else {
          log.warn('Model loading error:', logData);
        }
      }).catch(() => {
        // Fallback if logger fails to load
        if (error.type === 'memory' || error.type === 'render') {
          // eslint-disable-next-line no-console
          console.error('Critical model error:', logData);
        } else {
          // eslint-disable-next-line no-console
          console.warn('Model loading error:', logData);
        }
      });
    }

    // In production, you might want to send this to an error reporting service
    // this.reportError(logData);
  }
}

class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(private options: CircuitBreakerOptions) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.options.recoveryTimeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.options.failureThreshold) {
      this.state = 'open';
    }
  }
}

// Export the ModelError type explicitly
export type { ModelError };

// Utility functions for common error handling patterns
export const retryModelLoad = async <T>(
  loadFunction: () => Promise<T>
): Promise<T> => {
  return ErrorHandler.withRetry(
    loadFunction,
    {
      maxRetries: 3,
      baseDelay: 1000,
      retryCondition: (error) => {
        const classified = ErrorHandler.classifyError(error);
        return classified.recoverable && classified.type === 'network';
      },
    }
  );
};

export const handleModelError = (error: Error, context?: Record<string, unknown>): ModelError => {
  const classified = ErrorHandler.classifyError(error);
  ErrorHandler.logError(classified, context);
  return classified;
};

export const getUserFriendlyError = (error: ModelError) => {
  return ErrorHandler.getErrorMessage(error);
};
