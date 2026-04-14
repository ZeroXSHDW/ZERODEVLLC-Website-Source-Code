import { useEffect, useState, useCallback } from 'react';

interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  screenReader: boolean;
}

interface AccessibilityActions {
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  focusElement: (selector: string) => void;
  trapFocus: (container: HTMLElement) => () => void;
  skipToContent: (targetId: string) => void;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  highContrast: false,
  reducedMotion: false,
  largeText: false,
  screenReader: false,
};

export function useAccessibility(): AccessibilitySettings & AccessibilityActions {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);

  // Detect user preferences
  useEffect(() => {
    const mediaQueryHighContrast = window.matchMedia('(prefers-contrast: high)');
    const mediaQueryReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mediaQueryLargeText = window.matchMedia('(prefers-reduced-transparency: reduce)');

    const updateSettings = () => {
      setSettings({
        highContrast: mediaQueryHighContrast.matches,
        reducedMotion: mediaQueryReducedMotion.matches,
        largeText: mediaQueryLargeText.matches,
        // We can't reliably detect screen readers via UA, 
        // but we can check for common indicators or just assume they might be present
        screenReader: 'ontouchstart' in window && !window.matchMedia('(any-hover: hover)').matches, 
      });
    };

    updateSettings();

    // Listen for changes
    mediaQueryHighContrast.addEventListener('change', updateSettings);
    mediaQueryReducedMotion.addEventListener('change', updateSettings);
    mediaQueryLargeText.addEventListener('change', updateSettings);

    return () => {
      mediaQueryHighContrast.removeEventListener('change', updateSettings);
      mediaQueryReducedMotion.removeEventListener('change', updateSettings);
      mediaQueryLargeText.removeEventListener('change', updateSettings);
    };
  }, []);

  // Screen reader announcement
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (typeof document === 'undefined') return;

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';

    announcement.textContent = message;
    document.body.appendChild(announcement);

    // Remove after announcement - store timeout ID for cleanup
    const timeoutId = setTimeout(() => {
      if (announcement.parentNode) {
        document.body.removeChild(announcement);
      }
    }, 1000);

    // Return cleanup function
    return () => {
      clearTimeout(timeoutId);
      if (announcement.parentNode) {
        document.body.removeChild(announcement);
      }
    };
  }, []);

  // Focus management
  const focusElement = useCallback((selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
      // Scroll into view if needed
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // Focus trapping for modals
  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }

      if (e.key === 'Escape') {
        // Find close button or trigger close
        const closeButton = container.querySelector('[aria-label*="close"], .close-button') as HTMLElement;
        if (closeButton) {
          closeButton.click();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    if (firstElement) firstElement.focus();

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Skip links
  const skipToContent = useCallback((targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
      announce(`Skipped to ${target.getAttribute('aria-label') || target.textContent || 'content'}`);
    }
  }, [announce]);

  return {
    ...settings,
    announce,
    focusElement,
    trapFocus,
    skipToContent,
  };
}
