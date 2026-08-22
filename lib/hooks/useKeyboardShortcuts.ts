import { useEffect, useCallback } from "react";

interface KeyboardShortcutsConfig {
  onResetView?: () => void;
  onToggleRotation?: () => void;
  onToggleControls?: () => void;
  onPerformanceToggle?: () => void;
  onToggleKeyboardHelp?: () => void;
  onToggleModelInfo?: () => void;
  onCameraPreset?: (
    preset:
      | "front"
      | "back"
      | "left"
      | "right"
      | "top"
      | "bottom"
      | "isometric"
      | "isometric_back"
      | "angle_45"
      | "side_angle"
      | "close_front"
      | "close_top"
      | "wide_front"
      | "overview",
  ) => void;
}

export function useKeyboardShortcuts({
  onResetView,
  onToggleRotation,
  onToggleControls,
  onPerformanceToggle,
  onToggleKeyboardHelp,
  onToggleModelInfo,
  onCameraPreset,
}: KeyboardShortcutsConfig = {}) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      const key = event.key.toLowerCase();

      // Handle keyboard shortcuts
      switch (key) {
        case "r":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            onResetView?.();
          }
          break;

        case " ":
          // Only toggle rotation if no modifiers are pressed
          if (!event.ctrlKey && !event.metaKey && !event.altKey) {
            event.preventDefault();
            onToggleRotation?.();
          }
          break;

        case "c":
          event.preventDefault();
          onToggleControls?.();
          break;

        case "p":
          event.preventDefault();
          onPerformanceToggle?.();
          break;

        case "h":
          event.preventDefault();
          onToggleKeyboardHelp?.();
          break;

        case "i":
          event.preventDefault();
          onToggleModelInfo?.();
          break;

        case "1":
        case "2":
        case "3":
        case "4":
          event.preventDefault();
          const presets: Record<
            string,
            "front" | "left" | "top" | "isometric"
          > = {
            "1": "front",
            "2": "left",
            "3": "top",
            "4": "isometric",
          };
          onCameraPreset?.(presets[key]);
          break;

        default:
          break;
      }
    },
    [
      onResetView,
      onToggleRotation,
      onToggleControls,
      onPerformanceToggle,
      onToggleKeyboardHelp,
      onToggleModelInfo,
      onCameraPreset,
    ],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
