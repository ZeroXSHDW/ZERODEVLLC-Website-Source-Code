/**
 * Custom hook for managing viewer UI state
 * Separates UI concerns from model/rendering logic
 */

import { useState, useCallback } from "react";

export interface ViewerUIState {
  isControlsPanelOpen: boolean;
  isKeyboardHelpOpen: boolean;
  isModelInfoOpen: boolean;
  isPerformanceMonitorOpen: boolean;
  isExportDialogOpen: boolean;
  isMobileGestureHelpOpen: boolean;
  isCommandPaletteOpen?: boolean;
}

const initialUIState: ViewerUIState = {
  isControlsPanelOpen: false,
  isKeyboardHelpOpen: false,
  isModelInfoOpen: false,
  isPerformanceMonitorOpen: false,
  isExportDialogOpen: false,
  isMobileGestureHelpOpen: false,
};

export function useViewerState() {
  const [uiState, setUIState] = useState<ViewerUIState>(initialUIState);

  const toggleControlsPanel = useCallback(() => {
    setUIState((prev) => ({
      ...prev,
      isControlsPanelOpen: !prev.isControlsPanelOpen,
    }));
  }, []);

  const toggleKeyboardHelp = useCallback(() => {
    setUIState((prev) => ({
      ...prev,
      isKeyboardHelpOpen: !prev.isKeyboardHelpOpen,
    }));
  }, []);

  const toggleModelInfo = useCallback(() => {
    setUIState((prev) => ({ ...prev, isModelInfoOpen: !prev.isModelInfoOpen }));
  }, []);

  const togglePerformanceMonitor = useCallback(() => {
    setUIState((prev) => ({
      ...prev,
      isPerformanceMonitorOpen: !prev.isPerformanceMonitorOpen,
    }));
  }, []);

  const toggleExportDialog = useCallback(() => {
    setUIState((prev) => ({
      ...prev,
      isExportDialogOpen: !prev.isExportDialogOpen,
    }));
  }, []);

  const toggleMobileGestureHelp = useCallback(() => {
    setUIState((prev) => ({
      ...prev,
      isMobileGestureHelpOpen: !prev.isMobileGestureHelpOpen,
    }));
  }, []);

  const toggleCommandPalette = useCallback((isOpen?: boolean) => {
    setUIState((prev) => ({
      ...prev,
      isCommandPaletteOpen: isOpen ?? !prev.isCommandPaletteOpen,
    }));
  }, []);

  const closeAll = useCallback(() => {
    setUIState(initialUIState);
  }, []);

  return {
    uiState,
    toggleControlsPanel,
    toggleKeyboardHelp,
    toggleModelInfo,
    togglePerformanceMonitor,
    toggleExportDialog,
    toggleMobileGestureHelp,
    toggleCommandPalette,
    closeAll,
  };
}
