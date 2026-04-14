"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsHelp({ isOpen, onClose }: KeyboardShortcutsHelpProps) {
  const shortcuts = [
    { key: 'Ctrl/Cmd + R', description: 'Reset camera view' },
    { key: 'Space', description: 'Toggle auto-rotation' },
    { key: 'Ctrl/Cmd + C', description: 'Toggle controls panel' },
    { key: 'Ctrl/Cmd + P', description: 'Toggle performance mode' },
    { key: '1', description: 'Front camera preset' },
    { key: '2', description: 'Side camera preset' },
    { key: '3', description: 'Top camera preset' },
    { key: '4', description: 'Isometric camera preset' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 max-w-md w-full mx-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-blue-400" />
                <h3 className="text-white font-semibold">Keyboard Shortcuts</h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <span className="text-gray-300 text-sm">{shortcut.description}</span>
                    <kbd className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs text-white font-mono">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-500 text-center">
                  Press any key to close this dialog
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
