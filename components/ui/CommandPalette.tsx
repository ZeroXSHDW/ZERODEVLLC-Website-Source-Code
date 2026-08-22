"use client";

import * as React from "react";
import { Command } from "cmdk";
import {
  Settings,
  Palette,
  RotateCcw,
  Monitor,
  Camera,
  Layers,
} from "lucide-react";
import { ViewerSettings } from "@/lib/types/3d";
import { CAMERA_PRESETS } from "@/config/three";
import { toast } from "sonner";

// CommandItem wrapper
const CommandItemWrapper = ({
  children,
  onSelect,
}: {
  children: React.ReactNode;
  onSelect: () => void;
}) => {
  return (
    <Command.Item
      onSelect={onSelect}
      className="relative flex select-none items-center rounded-md px-2 py-1.5 text-sm outline-none aria-selected:bg-gray-800 aria-selected:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors cursor-pointer"
    >
      {children}
    </Command.Item>
  );
};

interface CommandPaletteProps {
  isOpen: boolean;
  onCloseAction: () => void;
  actions: {
    setAutoRotate: (value: boolean) => void;
    setPerformanceMode: (value: boolean) => void;
    onResetView: () => void;

    onCameraPreset: (preset: any) => void;

    updateLighting: (updates: any) => void;

    updateEnvironment: (updates: any) => void;

    updateLod: (updates: any) => void;
    toggleModelInfo: () => void;
    toggleControls: () => void;
  };
  currentSettings: ViewerSettings;
}

export function CommandPalette({
  isOpen,
  onCloseAction,
  actions,
  currentSettings,
}: CommandPaletteProps) {
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) {
          onCloseAction();
        } else {
          // Open logic handled by parent
        }
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, onCloseAction]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <Command className="w-full">
          <div
            className="flex items-center border-b border-gray-800 px-3"
            cmdk-input-wrapper=""
          >
            <Command.Input
              autoFocus
              placeholder="Type a command..."
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 text-white disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden py-2 px-2">
            <Command.Empty className="py-6 text-center text-sm text-gray-500">
              No results found.
            </Command.Empty>

            <Command.Group
              heading="Actions"
              className="text-gray-400 text-xs font-medium px-2 mb-2"
            >
              <CommandItemWrapper
                onSelect={() => {
                  actions.onResetView();
                  onCloseAction();
                  toast.success("View reset");
                }}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                <span>Reset View</span>
              </CommandItemWrapper>

              <CommandItemWrapper
                onSelect={() => {
                  actions.setAutoRotate(!currentSettings.autoRotate);
                  onCloseAction();
                  toast.success(
                    `Auto-rotate ${!currentSettings.autoRotate ? "enabled" : "disabled"}`,
                  );
                }}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                <span>Toggle Auto-rotate</span>
              </CommandItemWrapper>

              <CommandItemWrapper
                onSelect={() => {
                  actions.setPerformanceMode(!currentSettings.performanceMode);
                  onCloseAction();
                  toast.success(
                    `Performance mode ${!currentSettings.performanceMode ? "enabled" : "disabled"}`,
                  );
                }}
              >
                <Monitor className="mr-2 h-4 w-4" />
                <span>Toggle Performance Mode</span>
              </CommandItemWrapper>

              <CommandItemWrapper
                onSelect={() => {
                  actions.toggleModelInfo();
                  onCloseAction();
                }}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Toggle Model Info</span>
              </CommandItemWrapper>

              <CommandItemWrapper
                onSelect={() => {
                  actions.toggleControls();
                  onCloseAction();
                }}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Toggle Controls Panel</span>
              </CommandItemWrapper>
            </Command.Group>

            <Command.Group
              heading="Camera Presets"
              className="text-gray-400 text-xs font-medium px-2 mb-2 mt-2"
            >
              {Object.keys(CAMERA_PRESETS).map((preset) => (
                <CommandItemWrapper
                  key={preset}
                  onSelect={() => {
                    actions.onCameraPreset(preset);
                    onCloseAction();
                  }}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  <span>
                    Camera: {preset.charAt(0).toUpperCase() + preset.slice(1)}
                  </span>
                </CommandItemWrapper>
              ))}
            </Command.Group>

            <Command.Group
              heading="Environment"
              className="text-gray-400 text-xs font-medium px-2 mb-2 mt-2"
            >
              {[
                "sunset",
                "dawn",
                "night",
                "warehouse",
                "forest",
                "apartment",
                "studio",
                "city",
                "park",
                "lobby",
              ].map((env) => (
                <CommandItemWrapper
                  key={env}
                  onSelect={() => {
                    actions.updateEnvironment({ preset: env });
                    onCloseAction();
                    toast.success(`Environment changed to ${env}`);
                  }}
                >
                  <Palette className="mr-2 h-4 w-4" />
                  <span>
                    Environment: {env.charAt(0).toUpperCase() + env.slice(1)}
                  </span>
                </CommandItemWrapper>
              ))}
            </Command.Group>

            <Command.Group
              heading="Level of Detail (LOD)"
              className="text-gray-400 text-xs font-medium px-2 mb-2 mt-2"
            >
              <CommandItemWrapper
                onSelect={() => {
                  actions.updateLod({ enabled: !currentSettings.lod?.enabled });
                  onCloseAction();
                  toast.success(
                    `LOD ${!currentSettings.lod?.enabled ? "enabled" : "disabled"}`,
                  );
                }}
              >
                <Layers className="mr-2 h-4 w-4" />
                <span>Toggle LOD</span>
              </CommandItemWrapper>
              {["auto", "high", "medium", "low"].map((quality) => (
                <CommandItemWrapper
                  key={quality}
                  onSelect={() => {
                    actions.updateLod({ quality: quality });
                    onCloseAction();
                    toast.success(`LOD quality set to ${quality}`);
                  }}
                >
                  <Layers className="mr-2 h-4 w-4" />
                  <span>
                    LOD Quality:{" "}
                    {quality.charAt(0).toUpperCase() + quality.slice(1)}
                  </span>
                </CommandItemWrapper>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>

      {/* Backdrop click to close */}
      <div className="absolute inset-0 -z-10" onClick={onCloseAction} />
    </div>
  );
}
