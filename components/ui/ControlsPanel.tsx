"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Camera,
  Lightbulb,
  ChevronRight,
  Palette,
  Play,
  Layers,
  HardDrive,
  Sparkles,
  Upload,
  Camera as CameraIcon,
} from "lucide-react";
import type { ControlsPanelProps } from "@/lib/types";

// Modular Panels
import { CameraPanel } from "@/components/ui/controls/CameraPanel";
import { LightingPanel } from "@/components/ui/controls/LightingPanel";
import { EnvironmentPanel } from "@/components/ui/controls/EnvironmentPanel";
import { PostProcessingPanel } from "@/components/ui/controls/PostProcessingPanel";
import { ModelPanel } from "@/components/ui/controls/ModelPanel";
import { AnimationsPanel } from "@/components/ui/controls/AnimationsPanel";
import { SystemPanel } from "@/components/ui/controls/SystemPanel";
import { LODPanel } from "@/components/ui/controls/LODPanel";
import { UploadPanel } from "@/components/ui/controls/UploadPanel";
import { ExportPanel } from "@/components/ui/controls/ExportPanel";

export function ControlsPanel({
  isOpen,
  onToggleAction,
  onCameraPreset,
  onLightingChange,
  onModelSettingsChange,
  onEnvironmentChange,
  onPostProcessingChange,
  onResetView,
  onToggleRotation,
  onAnimationPlay,
  onAnimationPause,
  onAnimationSelect,
  onScreenshot,
  onFileUpload,
  onLodChange,
  currentSettings,
}: ControlsPanelProps) {
  const [activeTab, setActiveTab] = useState<
    | "camera"
    | "lighting"
    | "environment"
    | "postprocessing"
    | "model"
    | "animations"
    | "lod"
    | "upload"
    | "screenshot"
    | "system"
  >("camera");

  const tabs = [
    { id: "camera" as const, label: "Camera", icon: Camera },
    { id: "lighting" as const, label: "Lighting", icon: Lightbulb },
    { id: "environment" as const, label: "Environment", icon: Palette },
    { id: "postprocessing" as const, label: "Effects", icon: Sparkles },
    { id: "model" as const, label: "Model", icon: Settings },
    { id: "animations" as const, label: "Animations", icon: Play },
    { id: "lod" as const, label: "LOD", icon: Layers },
    { id: "upload" as const, label: "Upload", icon: Upload },
    { id: "screenshot" as const, label: "Export", icon: CameraIcon },
    { id: "system" as const, label: "System", icon: HardDrive },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 300, opacity: 0, scale: 0.95 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: 300, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-50 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden h-[600px] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-labelledby="controls-title"
          style={{
            boxShadow:
              "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)",
            width: "320px",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
            <h3
              id="controls-title"
              className="text-white font-semibold flex items-center gap-2"
            >
              <Settings className="w-4 h-4 text-blue-400" />
              Controls
            </h3>
            <button
              onClick={onToggleAction}
              className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg"
              aria-label="Close controls panel"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Sidebar Layout */}
          <div className="flex flex-1 overflow-hidden">
            {/* Tabs Sidebar */}
            <div className="w-16 flex flex-col items-center gap-2 py-4 bg-black/20 overflow-y-auto no-scrollbar border-r border-white/5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`p-3 rounded-xl transition-all duration-200 group relative ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                        : "text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                    title={tab.label}
                  >
                    <Icon className="w-5 h-5" />
                    {isActive && (
                      <motion.div
                        layoutId="activeTabGlow"
                        className="absolute inset-0 rounded-xl bg-blue-400/20 blur-sm -z-10"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 bg-gradient-to-br from-white/5 to-transparent">
              {activeTab === "camera" && (
                <CameraPanel
                  onCameraPreset={onCameraPreset}
                  onResetView={onResetView}
                />
              )}

              {activeTab === "lighting" && currentSettings && (
                <LightingPanel
                  currentSettings={currentSettings}
                  onLightingChange={onLightingChange}
                />
              )}

              {activeTab === "environment" && currentSettings && (
                <EnvironmentPanel
                  currentSettings={currentSettings}
                  onEnvironmentChange={onEnvironmentChange}
                />
              )}

              {activeTab === "postprocessing" && currentSettings && (
                <PostProcessingPanel
                  currentSettings={currentSettings}
                  onPostProcessingChange={onPostProcessingChange}
                />
              )}

              {/* Simplified Model Settings for brevity in response, keeping structure */}
              {activeTab === "model" && currentSettings && (
                <ModelPanel
                  currentSettings={currentSettings}
                  onToggleRotation={onToggleRotation}
                  onModelSettingsChange={onModelSettingsChange}
                />
              )}

              {activeTab === "animations" && currentSettings && (
                <AnimationsPanel
                  currentSettings={currentSettings}
                  onAnimationPlay={onAnimationPlay}
                  onAnimationPause={onAnimationPause}
                  onAnimationSelect={onAnimationSelect}
                />
              )}

              {activeTab === "system" && <SystemPanel />}

              {/* Placeholder for others to prevent empty space */}
              {activeTab === "lod" && currentSettings && (
                <LODPanel
                  currentSettings={currentSettings}
                  onLodChange={onLodChange}
                />
              )}

              {activeTab === "upload" && (
                <UploadPanel onFileUpload={onFileUpload} />
              )}

              {activeTab === "screenshot" && (
                <ExportPanel onScreenshot={onScreenshot} />
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <motion.button
          initial={{ x: 0 }}
          animate={{ x: 0 }}
          whileHover={{ x: -4, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleAction}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-black/40 backdrop-blur-md border border-white/10 rounded-l-xl p-3 shadow-lg text-white hover:bg-black/60 transition-colors group"
        >
          <Settings className="w-6 h-6 group-hover:rotate-45 transition-transform duration-500" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
