/**
 * Enhanced Error Boundary with recovery strategies
 */

"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { log } from '@/lib/utils/logger';
import { errorRecoveryManager } from '@/lib/utils/errorRecovery';
import type { ModelError } from '@/lib/types/3d';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableRecovery?: boolean;
  maxRetries?: number;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  isRecovering: boolean;
}

/**
 * Enhanced Error Boundary with automatic recovery
 */
export class EnhancedErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRecovering: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    log.error('Error caught by enhanced boundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    this.props.onError?.(error, errorInfo);

    // Attempt automatic recovery if enabled
    if (this.props.enableRecovery && this.state.retryCount < (this.props.maxRetries || 3)) {
      this.attemptRecovery(error);
    }
  }

  private async attemptRecovery(error: Error): Promise<void> {
    const modelError: ModelError = {
      type: 'load',
      message: error.message,
      originalError: error,
      recoverable: true,
    };

    this.setState({ isRecovering: true });

    try {
      const recovered = await errorRecoveryManager.attemptRecovery(modelError);
      
      if (recovered) {
        // Wait a bit before resetting
        this.retryTimeoutId = setTimeout(() => {
          this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: this.state.retryCount + 1,
            isRecovering: false,
          });
        }, 1000);
      } else {
        this.setState({ isRecovering: false });
      }
    } catch (recoveryError) {
      log.error('Recovery attempt failed:', recoveryError);
      this.setState({ isRecovering: false });
    }
  }

  private handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRecovering: false,
    });
  };

  componentWillUnmount(): void {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      if (this.state.isRecovering) {
        return (
          <div className="flex items-center justify-center w-full h-full bg-black text-yellow-400 font-mono p-8">
            <div className="text-center space-y-4">
              <div className="text-2xl font-bold">RECOVERING...</div>
              <div className="text-sm text-gray-500">Attempting to recover from error</div>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
            </div>
          </div>
        );
      }

      return (
        <div className="flex items-center justify-center w-full h-full bg-black text-red-400 font-mono p-8">
          <div className="text-center space-y-4">
            <div className="text-2xl font-bold">RENDERING ERROR</div>
            <div className="text-sm text-gray-500">
              {this.state.error?.message || 'An unexpected error occurred'}
            </div>
            {this.state.errorInfo && (
              <details className="text-xs text-gray-600 text-left max-w-md">
                <summary className="cursor-pointer">Error Details</summary>
                <pre className="mt-2 overflow-auto max-h-40">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            <div className="flex gap-2 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded border border-gray-600"
              >
                RETRY
              </button>
              {this.props.enableRecovery && (
                <button
                  onClick={() => this.attemptRecovery(this.state.error!)}
                  className="px-4 py-2 bg-blue-800 hover:bg-blue-700 rounded border border-blue-600"
                >
                  AUTO RECOVER
                </button>
              )}
            </div>
            {this.state.retryCount > 0 && (
              <div className="text-xs text-gray-500">
                Retry attempt: {this.state.retryCount}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

