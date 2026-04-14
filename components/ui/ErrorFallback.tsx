"use client";

import { motion } from 'framer-motion';
import { RefreshCw, Bug, Monitor, FileX, Wifi, Zap } from 'lucide-react';
import type { ErrorFallbackProps } from '@/lib/types';
import type { ModelError } from '@/lib/types/3d';

const errorVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

export function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  const getErrorDetails = () => {
    // Handle both Error and ModelError types
    const isModelError = error && 'type' in error;
    const message = error?.message || '';

    if (isModelError) {
      const modelError = error as ModelError;
      switch (modelError.type) {
        case 'network':
          return {
            icon: Wifi,
            title: 'Connection Error',
            message: modelError.message,
            solutions: [
              'Check your internet connection',
              'Try refreshing the page',
              'Contact support if the problem persists',
            ],
          };
        case 'memory':
          return {
            icon: Zap,
            title: 'Memory Error',
            message: modelError.message,
            solutions: [
              'Close other browser tabs and applications',
              'Try a simpler 3D model',
              'Restart your browser',
            ],
          };
        case 'parse':
          return {
            icon: FileX,
            title: 'File Error',
            message: modelError.message,
            solutions: [
              'Check that the file is a valid GLTF/GLB format',
              'Ensure the file is not corrupted',
              'Try uploading a different model file',
            ],
          };
        case 'render':
          return {
            icon: Monitor,
            title: 'Rendering Error',
            message: modelError.message,
            solutions: [
              'Update your browser to the latest version',
              'Enable hardware acceleration in browser settings',
              'Try using a different browser',
            ],
          };
        default:
          return {
            icon: Bug,
            title: 'Loading Error',
            message: modelError.message,
            solutions: [
              'Try refreshing the page',
              'Check the browser console for more details',
              'Contact support if the problem persists',
            ],
          };
      }
    }

    if (message.includes('WebGL')) {
      return {
        icon: Monitor,
        title: 'WebGL Not Supported',
        message: 'Your browser or device does not support WebGL, which is required for 3D rendering.',
        type: 'webgl',
        solutions: [
          'Update your browser to the latest version',
          'Try using Chrome, Firefox, or Edge',
          'Enable hardware acceleration in browser settings',
          'Check if your graphics drivers are up to date'
        ]
      };
    }

    if (message.includes('load') || message.includes('fetch')) {
      return {
        icon: FileX,
        title: 'Failed to Load Model',
        message: 'The 3D model file could not be loaded. This might be due to network issues or an invalid file.',
        type: 'network',
        solutions: [
          'Check your internet connection',
          'Verify the model file is not corrupted',
          'Try uploading a different file',
          'Ensure the file size is under 50MB'
        ]
      };
    }

    if (message.includes('memory') || message.includes('heap')) {
      return {
        icon: Zap,
        title: 'Out of Memory',
        message: 'The application ran out of memory while processing the 3D model.',
        type: 'memory',
        solutions: [
          'Try a simpler 3D model',
          'Enable performance mode in settings',
          'Close other browser tabs',
          'Restart your browser'
        ]
      };
    }

    return {
      icon: Bug,
      title: 'Unexpected Error',
      message: message || 'An unexpected error occurred while rendering the 3D scene.',
      type: 'generic',
      solutions: [
        'Try refreshing the page',
        'Clear your browser cache',
        'Disable browser extensions temporarily',
        'Contact support if the problem persists'
      ]
    };
  };

  const errorDetails = getErrorDetails();
  const ErrorIcon = errorDetails.icon;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={errorVariants}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center w-full h-full bg-gradient-to-br from-black via-gray-900 to-black p-4"
    >
      <div className="text-center space-y-6 max-w-lg px-6 py-8 bg-gray-900/80 backdrop-blur-sm rounded-xl border border-red-500/20 shadow-2xl">
        {/* Error icon */}
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
          className="mx-auto w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center"
        >
          <ErrorIcon className="w-10 h-10 text-red-400" />
        </motion.div>

        {/* Error title */}
        <div>
          <div className="text-2xl font-bold font-mono text-red-400 mb-2">
            {errorDetails.title}
          </div>
          <div className="text-sm text-gray-400 leading-relaxed">
            {errorDetails.message}
          </div>
        </div>

        {/* Technical details (collapsible) */}
        {error && 'stack' in error && error.stack && (
          <details className="text-left bg-gray-800/50 rounded-lg p-3">
            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-400">
              Technical Details
            </summary>
            <pre className="text-xs text-gray-600 mt-2 overflow-auto max-h-32 whitespace-pre-wrap">
              {error.message}
              {error.stack && '\n\nStack Trace:\n' + error.stack}
            </pre>
          </details>
        )}

        {/* Solutions */}
        <div className="text-left bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <h4 className="text-blue-400 font-medium text-sm mb-3 flex items-center gap-2">
            <Wifi className="w-4 h-4" />
            Suggested Solutions
          </h4>
          <ul className="space-y-2 text-sm text-blue-300">
            {errorDetails.solutions.map((solution, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>{solution}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 justify-center">
          {onRetry && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRetry}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Page
          </motion.button>
        </div>

        {/* Error code for support */}
        <div className="text-xs text-gray-600 pt-4 border-t border-gray-800">
          Error ID: {errorDetails.type}-{Date.now().toString(36)}
        </div>
      </div>
    </motion.div>
  );
}
