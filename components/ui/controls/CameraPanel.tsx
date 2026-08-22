import { CAMERA_PRESETS } from "@/config/three";
import { RotateCcw } from "lucide-react";

interface CameraPanelProps {
  onCameraPreset?: (preset: any) => void;
  onResetView?: () => void;
}

export function CameraPanel({ onCameraPreset, onResetView }: CameraPanelProps) {
  const presets = [
    { name: "Front", preset: "front", desc: "Standard front view" },
    { name: "Back", preset: "back", desc: "Back view" },
    { name: "Left", preset: "left", desc: "Left side view" },
    { name: "Right", preset: "right", desc: "Right side view" },
    { name: "Top", preset: "top", desc: "Top-down view" },
    { name: "Bottom", preset: "bottom", desc: "Bottom-up view" },
    { name: "Isometric", preset: "isometric", desc: "3D isometric view" },
    { name: "Back Iso", preset: "isometric_back", desc: "Back isometric" },
    { name: "45° Angle", preset: "angle_45", desc: "Angled perspective" },
    { name: "Side Angle", preset: "side_angle", desc: "Side perspective" },
    { name: "Close Front", preset: "close_front", desc: "Close-up front" },
    { name: "Close Top", preset: "close_top", desc: "Close-up top" },
    { name: "Wide Front", preset: "wide_front", desc: "Wide angle front" },
    { name: "Overview", preset: "overview", desc: "High overview" },
  ] as const;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <h4 className="text-white font-medium mb-3">Camera Presets</h4>
      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
        {presets.map((preset) => (
          <button
            key={preset.preset}
            onClick={() => onCameraPreset?.(preset.preset)}
            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded transition-colors text-left group"
            title={preset.desc}
          >
            <div className="font-medium group-hover:text-blue-400 transition-colors">
              {preset.name}
            </div>
            <div className="text-xs text-gray-400 truncate">{preset.desc}</div>
          </button>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-700">
        <button
          onClick={onResetView}
          className="flex items-center gap-2 w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors justify-center font-medium shadow-lg hover:shadow-blue-500/25"
        >
          <RotateCcw className="w-4 h-4" />
          Reset View
        </button>
      </div>
    </div>
  );
}
