import { ViewerSettings } from "@/lib/types/3d";

interface PostProcessingPanelProps {
  currentSettings: ViewerSettings;
  onPostProcessingChange?: (updates: {
    toneMapping?: { enabled?: boolean; exposure?: number };
  }) => void;
}

export function PostProcessingPanel({
  currentSettings,
  onPostProcessingChange,
}: PostProcessingPanelProps) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <h4 className="text-white font-medium mb-3">Visual Effects</h4>
      <div className="space-y-3">
        {/* Tone Mapping Toggle */}
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
          <span className="text-sm text-gray-300">Tone Mapping</span>
          <button
            onClick={() =>
              onPostProcessingChange?.({
                toneMapping: {
                  ...currentSettings?.postProcessing?.toneMapping,
                  enabled:
                    !currentSettings?.postProcessing?.toneMapping?.enabled,
                },
              })
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              currentSettings?.postProcessing?.toneMapping?.enabled
                ? "bg-blue-600"
                : "bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                currentSettings?.postProcessing?.toneMapping?.enabled
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Exposure Control */}
        {currentSettings?.postProcessing?.toneMapping?.enabled && (
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Exposure:{" "}
              {(
                currentSettings?.postProcessing?.toneMapping?.exposure || 1.0
              ).toFixed(1)}
            </label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={
                currentSettings?.postProcessing?.toneMapping?.exposure || 1.0
              }
              onChange={(e) =>
                onPostProcessingChange?.({
                  toneMapping: {
                    ...currentSettings?.postProcessing?.toneMapping,
                    exposure: parseFloat(e.target.value),
                  },
                })
              }
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}
