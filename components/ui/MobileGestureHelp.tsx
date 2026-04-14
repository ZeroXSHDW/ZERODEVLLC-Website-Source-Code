"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ZoomIn, Move, X, Smartphone } from 'lucide-react';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';

interface MobileGestureHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileGestureHelp({ isOpen, onClose }: MobileGestureHelpProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { lightTap, mediumTap } = useHapticFeedback();

  useEffect(() => {
    // Ensure we're on the client side
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return;
    }

    const checkMobile = () => {
      try {
        setIsMobile(
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          ) || window.innerWidth <= 768
        );
      } catch {
        // Fallback to desktop if detection fails
        setIsMobile(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Only show on mobile devices
  if (!isMobile) return null;

  const gestures = [
    {
      icon: RotateCcw,
      title: 'Rotate',
      description: 'Touch and drag with one finger to rotate the model',
      demo: '↻ Drag',
      color: 'text-blue-400',
      animation: 'rotate',
    },
    {
      icon: ZoomIn,
      title: 'Zoom',
      description: 'Pinch with two fingers to zoom in/out',
      demo: '🤏 Pinch',
      color: 'text-green-400',
      animation: 'pinch',
    },
    {
      icon: Move,
      title: 'Pan',
      description: 'Drag with two fingers to move the view',
      demo: '👆👆 Drag',
      color: 'text-purple-400',
      animation: 'pan',
    },
    {
      icon: Smartphone,
      title: 'Controls',
      description: 'Tap the gear icon to access settings and tools',
      demo: '⚙️ Tap',
      color: 'text-orange-400',
      animation: 'tap',
    },
  ];

  const nextStep = () => {
    if (currentStep < gestures.length - 1) {
      setCurrentStep(currentStep + 1);
      lightTap();
    } else {
      onClose();
      mediumTap();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      lightTap();
    }
  };

  return (
    <>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 max-w-sm w-full mx-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-400" />
                <h3 className="text-white font-semibold">
                  Touch Tutorial ({currentStep + 1}/{gestures.length})
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1"
                aria-label="Close touch gestures help"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Progress indicator */}
              <div className="flex justify-center mb-6">
                <div className="flex space-x-2">
                  {gestures.map((_, index) => (
                    <motion.div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentStep ? 'bg-blue-400' : 'bg-gray-600'
                      }`}
                      animate={{
                        scale: index === currentStep ? 1.2 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  ))}
                </div>
              </div>

              {/* Current gesture */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center space-y-4"
                >
                  <div className="flex justify-center">
                    <motion.div
                      animate={
                        gestures[currentStep].animation === 'rotate'
                          ? { rotate: 360 }
                          : gestures[currentStep].animation === 'pinch'
                          ? { scale: [1, 1.2, 1] }
                          : gestures[currentStep].animation === 'tap'
                          ? { scale: [1, 1.1, 1] }
                          : { x: [0, 10, 0] }
                      }
                      transition={{
                        duration: gestures[currentStep].animation === 'rotate' ? 3 : 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center"
                    >
                      {(() => {
                        const Icon = gestures[currentStep].icon;
                        return <Icon className={`w-8 h-8 ${gestures[currentStep].color}`} />;
                      })()}
                    </motion.div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold text-lg mb-2">
                      {gestures[currentStep].title}
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      {gestures[currentStep].description}
                    </p>
                    <div className="text-2xl mb-2">{gestures[currentStep].demo}</div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <motion.div
                    animate={{ x: currentStep === 0 ? 0 : [-2, 0] }}
                    transition={{ duration: 0.2 }}
                  >
                    ←
                  </motion.div>
                  Previous
                </button>

                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  {currentStep === gestures.length - 1 ? 'Got it!' : 'Next'}
                  <motion.div
                    animate={{ x: currentStep === gestures.length - 1 ? 0 : [0, 2] }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentStep === gestures.length - 1 ? '✓' : '→'}
                  </motion.div>
                </button>
              </div>

              {/* Skip option */}
              <div className="mt-4 text-center">
                <button
                  onClick={onClose}
                  className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
                >
                  Skip tutorial
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}
