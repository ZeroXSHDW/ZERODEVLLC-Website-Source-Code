"use client";

import { motion } from 'framer-motion';
import { HelpCircle, Info, Hand, Activity, Download } from 'lucide-react';

interface ViewerActionButtonsProps {
  isMobile: boolean;
  hasSceneData: boolean;
  onToggleModelInfo: () => void;
  onToggleMobileGestureHelp: () => void;
  onToggleKeyboardHelp: () => void;
  onTogglePerformanceMonitor: () => void;
  onToggleExportDialog: () => void;
}

export function ViewerActionButtons({
  isMobile,
  hasSceneData,
  onToggleModelInfo,
  onToggleMobileGestureHelp,
  onToggleKeyboardHelp,
  onTogglePerformanceMonitor,
  onToggleExportDialog,
}: ViewerActionButtonsProps) {
  const buttonSize = isMobile ? 'p-4 min-w-[48px] min-h-[48px]' : 'p-3';
  const iconSize = isMobile ? 'w-6 h-6' : 'w-5 h-5';

  return (
    <div className="fixed bottom-4 right-4 z-30 flex gap-3">
      {/* Model Info Button */}
      <motion.button
        onClick={onToggleModelInfo}
        disabled={!hasSceneData}
        className={`relative bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-full text-white transition-all duration-200 shadow-lg hover:shadow-xl ${buttonSize} ${
          !hasSceneData ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800 hover:border-gray-600 hover:scale-105'
        }`}
        title="Model information"
        aria-label={hasSceneData ? "View detailed model information" : "Model information not available"}
        aria-describedby="model-info-button-desc"
        whileHover={!hasSceneData ? {} : { scale: 1.1 }}
        whileTap={!hasSceneData ? {} : { scale: 0.95 }}
      >
        <Info className={`${iconSize} transition-transform group-hover:rotate-12`} />

        {/* Glow effect for available features */}
        {hasSceneData && (
          <motion.div
            className="absolute inset-0 rounded-full bg-blue-500/20"
            animate={{
              opacity: [0, 0.5, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.button>

      {/* Mobile Gesture Help Button */}
      {isMobile && (
        <motion.button
          onClick={onToggleMobileGestureHelp}
          className={`relative bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-full ${buttonSize} text-white hover:bg-gray-800 hover:border-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105`}
          title="Touch gestures tutorial"
          aria-label="Open touch gestures tutorial"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <Hand className={`${iconSize} transition-transform group-hover:scale-110`} />

          {/* Pulsing indicator for tutorial */}
          <motion.div
            className="absolute inset-0 rounded-full bg-purple-500/20"
            animate={{
              opacity: [0, 0.5, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </motion.button>
      )}

      {/* Keyboard Shortcuts Help Button */}
      <motion.button
        onClick={onToggleKeyboardHelp}
        className={`relative bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-full text-white transition-all duration-200 shadow-lg hover:shadow-xl ${buttonSize} hover:bg-gray-800 hover:border-gray-600 hover:scale-105`}
        title={isMobile ? "Touch gestures tutorial" : "Keyboard shortcuts"}
        aria-label={isMobile ? "Open touch gestures tutorial" : "View keyboard shortcuts and help"}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMobile ? <Hand className={iconSize} /> : <HelpCircle className={iconSize} />}

        {/* Subtle breathing effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-green-500/20"
          animate={{
            opacity: [0, 0.3, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </motion.button>

      {/* Performance Monitor Button */}
      <motion.button
        onClick={onTogglePerformanceMonitor}
        className={`relative bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-full text-white transition-all duration-200 shadow-lg hover:shadow-xl ${buttonSize} hover:bg-gray-800 hover:border-gray-600 hover:scale-105`}
        title="Performance monitor"
        aria-label="Open performance monitor and statistics"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Activity className={`transition-transform ${iconSize} group-hover:scale-110`} />

        {/* Activity indicator */}
        <motion.div
          className="absolute inset-0 rounded-full bg-red-500/20"
          animate={{
            opacity: [0, 0.4, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />
      </motion.button>

      {/* Export Button */}
      <motion.button
        onClick={onToggleExportDialog}
        className={`relative bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-full text-white transition-all duration-200 shadow-lg hover:shadow-xl ${buttonSize} hover:bg-gray-800 hover:border-gray-600 hover:scale-105`}
        title="Export options"
        aria-label="Open export dialog with screenshot and download options"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Download className={`${iconSize} transition-transform group-hover:translate-y-[-2px]`} />

        {/* Success glow on export */}
        <motion.div
          className="absolute inset-0 rounded-full bg-yellow-500/20"
          animate={{
            opacity: [0, 0.6, 0],
            scale: [1, 1.25, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </motion.button>
    </div>
  );
}

