import { ViewerSettings } from "@/lib/types/3d";
import { Palette } from "lucide-react";

interface EnvironmentPanelProps {
  currentSettings: ViewerSettings;
  onEnvironmentChange?: (updates: {
    preset?:
      | "sunset"
      | "dawn"
      | "night"
      | "warehouse"
      | "forest"
      | "apartment"
      | "studio"
      | "city"
      | "park"
      | "lobby";
    intensity?: number;
    enabled?: boolean;
  }) => void;
}

type EnvironmentPreset = NonNullable<
  Parameters<
    NonNullable<EnvironmentPanelProps["onEnvironmentChange"]>
  >[0]["preset"]
>;

export function EnvironmentPanel({
  currentSettings,
  onEnvironmentChange,
}: EnvironmentPanelProps) {
  const presets: EnvironmentPreset[] = [
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
  ];

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <h4 className="text-white font-medium mb-3">Environment</h4>

      {/* Environment Enabled */}
      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-gray-300">Environment Map</span>
        </div>
        <button
          onClick={() =>
            onEnvironmentChange?.({
              ...currentSettings?.environment,
              enabled: !currentSettings?.environment?.enabled,
            })
          }
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            currentSettings?.environment?.enabled
              ? "bg-blue-600"
              : "bg-gray-600"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              currentSettings?.environment?.enabled
                ? "translate-x-6"
                : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {currentSettings?.environment?.enabled && (
        <div className="space-y-4 pt-2">
          {/* Environment Presets */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Preset</label>
            <select
              value={currentSettings?.environment?.preset || "studio"}
              onChange={(e) =>
                onEnvironmentChange?.({
                  ...currentSettings?.environment,
                  preset: e.target.value as EnvironmentPreset,
                })
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              {presets.map((preset) => (
                <option key={preset} value={preset}>
                  {preset.charAt(0).toUpperCase() + preset.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Environment Intensity */}
          <div>
            <label className="block text-sm text-gray-300 mb-2 flex justify-between">
              <span>Intensity</span>
              <span className="text-blue-400 font-mono">
                {(currentSettings?.environment?.intensity || 1).toFixed(1)}
              </span>
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={currentSettings?.environment?.intensity || 1}
              onChange={(e) =>
                onEnvironmentChange?.({
                  ...currentSettings?.environment,
                  intensity: parseFloat(e.target.value),
                })
              }
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
