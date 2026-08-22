import { ViewerSettings } from "@/lib/types/3d";

interface LightingPanelProps {
  currentSettings: ViewerSettings;
  onLightingChange?: (updates: {
    ambient?: number;
    directional?: number;
    point?: number;
  }) => void;
}

export function LightingPanel({
  currentSettings,
  onLightingChange,
}: LightingPanelProps) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <h4 className="text-white font-medium mb-3">Lighting Controls</h4>

      {/* Ambient Light */}
      <div>
        <label className="block text-sm text-gray-300 mb-2 flex justify-between">
          <span>Ambient Intensity</span>
          <span className="text-blue-400 font-mono">
            {(currentSettings?.lighting?.ambient || 0.4).toFixed(1)}
          </span>
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={currentSettings?.lighting?.ambient || 0.4}
          onChange={(e) =>
            onLightingChange?.({
              ...currentSettings?.lighting,
              ambient: parseFloat(e.target.value),
            })
          }
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      {/* Directional Light */}
      <div>
        <label className="block text-sm text-gray-300 mb-2 flex justify-between">
          <span>Directional Intensity</span>
          <span className="text-blue-400 font-mono">
            {(currentSettings?.lighting?.directional || 1.2).toFixed(1)}
          </span>
        </label>
        <input
          type="range"
          min="0"
          max="3"
          step="0.1"
          value={currentSettings?.lighting?.directional || 1.2}
          onChange={(e) =>
            onLightingChange?.({
              ...currentSettings?.lighting,
              directional: parseFloat(e.target.value),
            })
          }
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      {/* Point Light */}
      <div>
        <label className="block text-sm text-gray-300 mb-2 flex justify-between">
          <span>Point Light Intensity</span>
          <span className="text-blue-400 font-mono">
            {(currentSettings?.lighting?.point || 0.5).toFixed(1)}
          </span>
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={currentSettings?.lighting?.point || 0.5}
          onChange={(e) =>
            onLightingChange?.({
              ...currentSettings?.lighting,
              point: parseFloat(e.target.value),
            })
          }
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>
    </div>
  );
}
