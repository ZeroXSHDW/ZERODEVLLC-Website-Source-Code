"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface PerformanceSettings {
  mode: "normal" | "performance";
  fps: number;
  targetFps: number;
  adaptiveQuality: boolean;
}

interface PerformanceContextType {
  settings: PerformanceSettings;
  updateSettings: (updates: Partial<PerformanceSettings>) => void;
  isPerformanceMode: boolean;
  togglePerformanceMode: () => void;
  getRecommendedSettings: (currentFps: number) => Partial<PerformanceSettings>;
}

const defaultSettings: PerformanceSettings = {
  mode: "normal",
  fps: 60,
  targetFps: 30,
  adaptiveQuality: true,
};

const PerformanceContext = createContext<PerformanceContextType | null>(null);

interface PerformanceProviderProps {
  children: ReactNode;
}

export function PerformanceProvider({ children }: PerformanceProviderProps) {
  const [settings, setSettings] =
    useState<PerformanceSettings>(defaultSettings);

  const updateSettings = useCallback(
    (updates: Partial<PerformanceSettings>) => {
      setSettings((prev) => ({ ...prev, ...updates }));
    },
    [],
  );

  const togglePerformanceMode = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      mode: prev.mode === "normal" ? "performance" : "normal",
    }));
  }, []);

  const getRecommendedSettings = useCallback((currentFps: number) => {
    if (currentFps >= 55) {
      return { mode: "normal" as const, targetFps: 60 };
    }
    if (currentFps >= 25) {
      return { mode: "normal" as const, targetFps: 30 };
    }
    return { mode: "performance" as const, targetFps: 25 };
  }, []);

  const contextValue: PerformanceContextType = {
    settings,
    updateSettings,
    isPerformanceMode: settings.mode === "performance",
    togglePerformanceMode,
    getRecommendedSettings,
  };

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformanceContext() {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error(
      "usePerformanceContext must be used within a PerformanceProvider",
    );
  }
  return context;
}
