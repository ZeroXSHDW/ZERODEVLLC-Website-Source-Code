"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkipForward } from 'lucide-react';

export function SkipLinks() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show skip links when Tab is first pressed
      if (e.key === 'Tab' && !isVisible) {
        setIsVisible(true);
      }
    };

    const handleFocus = () => {
      setIsVisible(true);
    };

    // Hide skip links when clicking outside or after timeout
    const handleClick = () => {
      setIsVisible(false);
    };

    const handleTimeout = () => {
      setIsVisible(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocus);
    document.addEventListener('click', handleClick);

    const timer = setTimeout(handleTimeout, 3000);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('click', handleClick);
      clearTimeout(timer);
    };
  }, [isVisible]);

  const skipLinks = [
    { href: '#main-content', label: 'Skip to main content' },
    { href: '#controls', label: 'Skip to controls' },
    { href: '#model-info', label: 'Skip to model information' },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 left-4 z-50 flex gap-2"
        >
          {skipLinks.map((link, index) => (
            <motion.a
              key={link.href}
              href={link.href}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
              <span className="text-sm font-medium">{link.label}</span>
            </motion.a>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
