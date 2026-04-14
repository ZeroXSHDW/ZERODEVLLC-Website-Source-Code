"use client";

import loadable from '@loadable/component';
import React from 'react';

// Lazy load heavy UI components that are not immediately needed
// Using @loadable/component for better SSR support, preloading, and error handling
export const LazyControlsPanel = loadable(
  () => import('../../components/ui/ControlsPanel').then(module => ({ default: module.ControlsPanel })),
  {
    fallback: React.createElement('div', { className: 'text-gray-400 text-sm' }, 'Loading controls...'),
  }
);

export const LazyKeyboardShortcutsHelp = loadable(
  () => import('../../components/ui/KeyboardShortcutsHelp').then(module => ({ default: module.KeyboardShortcutsHelp }))
);

export const LazyModelInfo = loadable(
  () => import('../../components/ui/ModelInfo').then(module => ({ default: module.ModelInfo })),
  {
    fallback: React.createElement('div', { className: 'text-gray-400 text-sm' }, 'Loading model info...'),
  }
);

export const LazyMobileGestureHelp = loadable(
  () => import('../../components/ui/MobileGestureHelp').then(module => ({ default: module.MobileGestureHelp }))
);

export const LazyPerformanceMonitor = loadable(
  () => import('../../components/ui/PerformanceMonitor').then(module => ({ default: module.PerformanceMonitor })),
  {
    fallback: React.createElement('div', { className: 'text-gray-400 text-sm' }, 'Loading performance monitor...'),
  }
);

export const LazyExportDialog = loadable(
  () => import('../../components/ui/ExportDialog').then(module => ({ default: module.ExportDialog })),
  {
    fallback: React.createElement('div', { className: 'text-gray-400 text-sm' }, 'Loading export dialog...'),
  }
);

export const LazyMobileControls = loadable(
  () => import('../../components/ui/MobileControls').then(module => ({ default: module.MobileControls }))
);

export const LazyCommandPalette = loadable(
  () => import('../../components/ui/CommandPalette').then(module => ({ default: module.CommandPalette }))
);

// Smart preloading based on user behavior
// Now using @loadable/component's built-in preload() method
export const setupSmartPreloading = () => {
  let preloadTimeout: NodeJS.Timeout;

  const handleFirstInteraction = () => {
    // Clear any existing timeout
    if (preloadTimeout) {
      clearTimeout(preloadTimeout);
    }

    // Preload heavy components after user interaction (reduced delay for better UX)
    // Using @loadable/component's preload() method for better control
    preloadTimeout = setTimeout(() => {
      // Preload components that might be needed soon
      LazyExportDialog.load();
      LazyModelInfo.load();
      LazyPerformanceMonitor.load();
      LazyControlsPanel.load();
    }, 1000);
  };

  const events = ['mousedown', 'touchstart', 'keydown', 'scroll'];
  events.forEach(event => {
    document.addEventListener(event, handleFirstInteraction, { once: true });
  });

  return () => {
    events.forEach(event => {
      document.removeEventListener(event, handleFirstInteraction);
    });
    if (preloadTimeout) {
      clearTimeout(preloadTimeout);
    }
  };
};

// Export preload functions for manual preloading
export const preloadAllComponents = () => {
  LazyControlsPanel.load();
  LazyKeyboardShortcutsHelp.load();
  LazyModelInfo.load();
  LazyMobileGestureHelp.load();
  LazyPerformanceMonitor.load();
  LazyExportDialog.load();
  LazyMobileControls.load();
};