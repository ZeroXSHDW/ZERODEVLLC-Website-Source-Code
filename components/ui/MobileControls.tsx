"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Camera,
  RotateCcw,
  Download,
  Upload,
  Activity,
  Info,
  HelpCircle,
  ChevronUp,
  Home,
  RotateCw
} from 'lucide-react';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';

interface MobileControlsProps {
  isControlsPanelOpen: boolean;
  onToggleControlsPanel: () => void;
  onCameraPreset: (preset: keyof typeof import('@/config/three').CAMERA_PRESETS) => void;
  onScreenshot: () => void;
  onFileUpload: (file: File) => void;
  onPerformanceToggle: () => void;
  onModelInfoToggle: () => void;
  onHelpToggle: () => void;
  onResetView: () => void;
  onToggleRotation: () => void;
  isAutoRotate: boolean;
  className?: string;
}

export function MobileControls({
  isControlsPanelOpen,
  onToggleControlsPanel,
  onCameraPreset,
  onScreenshot,
  onFileUpload,
  onPerformanceToggle,
  onModelInfoToggle,
  onHelpToggle,
  onResetView,
  onToggleRotation,
  isAutoRotate,
  className
}: MobileControlsProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { lightTap, mediumTap } = useHapticFeedback();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) return null;

  const quickActions = [
    {
      icon: Home,
      label: 'Reset',
      action: () => {
        onResetView();
        lightTap();
      },
      color: 'text-blue-400',
    },
    {
      icon: isAutoRotate ? RotateCw : RotateCcw,
      label: isAutoRotate ? 'Stop' : 'Rotate',
      action: () => {
        onToggleRotation();
        lightTap();
      },
      color: isAutoRotate ? 'text-red-400' : 'text-green-400',
    },
    {
      icon: Download,
      label: 'Screenshot',
      action: () => {
        onScreenshot();
        mediumTap();
      },
      color: 'text-purple-400',
    },
    {
      icon: Camera,
      label: 'Front View',
      action: () => {
        onCameraPreset('front');
        lightTap();
      },
      color: 'text-cyan-400',
    },
  ];

  const expandedActions = [
    {
      icon: Upload,
      label: 'Upload',
      action: () => {
        // Trigger file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.glb,.gltf';
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            onFileUpload(file);
            mediumTap();
          }
        };
        input.click();
      },
      color: 'text-orange-400',
    },
    {
      icon: Activity,
      label: 'Performance',
      action: () => {
        onPerformanceToggle();
        lightTap();
      },
      color: 'text-yellow-400',
    },
    {
      icon: Info,
      label: 'Model Info',
      action: () => {
        onModelInfoToggle();
        lightTap();
      },
      color: 'text-indigo-400',
    },
    {
      icon: HelpCircle,
      label: 'Help',
      action: () => {
        onHelpToggle();
        lightTap();
      },
      color: 'text-pink-400',
    },
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 ${className || ''}`}>
      {/* Expanded Actions Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 p-4"
          >
            <div className="grid grid-cols-4 gap-3">
              {expandedActions.map((action, index) => (
                <motion.button
                  key={action.label}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={action.action}
                  className="flex flex-col items-center gap-2 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  <action.icon className={`w-6 h-6 ${action.color}`} />
                  <span className="text-xs text-gray-300 text-center">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Controls Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 px-4 py-3"
      >
        <div className="flex items-center justify-between">
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={action.action}
                className="flex flex-col items-center gap-1 p-2 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors min-w-[60px]"
              >
                <action.icon className={`w-5 h-5 ${action.color}`} />
                <span className="text-xs text-gray-300">{action.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Settings & Expand */}
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsExpanded(!isExpanded);
                lightTap();
              }}
              className={`p-3 rounded-full transition-colors ${
                isExpanded
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronUp className="w-5 h-5" />
              </motion.div>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onToggleControlsPanel();
                lightTap();
              }}
              className={`p-3 rounded-full transition-colors ${
                isControlsPanelOpen
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Expand Hint */}
        <AnimatePresence>
          {!isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 text-center"
            >
              <span className="text-xs text-gray-500">Swipe up for more options</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
