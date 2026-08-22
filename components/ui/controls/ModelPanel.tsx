import { ViewerSettings } from "@/lib/types/3d";

interface ModelPanelProps {
  currentSettings: ViewerSettings;
  onToggleRotation?: () => void;
  onModelSettingsChange?: (settings: ViewerSettings) => void;
}

export function ModelPanel({
  currentSettings,
  onToggleRotation,
  onModelSettingsChange,
}: ModelPanelProps) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <h4 className="text-white font-medium mb-3">Model Settings</h4>
      {/* Auto Rotation */}
      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
        <span className="text-sm text-gray-300">Auto Rotation</span>
        <button
          onClick={onToggleRotation}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            currentSettings?.autoRotate ? "bg-blue-600" : "bg-gray-600"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              currentSettings?.autoRotate ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
      {/* Scale */}
      <div>
        <label className="block text-sm text-gray-300 mb-2">Scale</label>
        <input
          type="range"
          min="0.5"
          max="5"
          step="0.1"
          value={currentSettings?.scale || 1}
          onChange={(e) =>
            onModelSettingsChange?.({
              ...currentSettings,
              scale: parseFloat(e.target.value),
            })
          }
          className="w-full h-2 bg-gray-700 rounded-lg cursor-pointer accent-blue-500"
        />
      </div>
    </div>
  );
}
