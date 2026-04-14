"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { log } from '@/lib/utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary specifically for model loading and rendering errors
 */
export class ModelErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    log.error('Model error caught by boundary:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center w-full h-full bg-black text-red-400 font-mono p-8">
          <div className="text-center space-y-4">
            <div className="text-2xl font-bold">MODEL ERROR</div>
            <div className="text-sm text-gray-500">
              {this.state.error?.message || 'Failed to load or render model'}
            </div>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded border border-gray-600"
            >
              RETRY
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

