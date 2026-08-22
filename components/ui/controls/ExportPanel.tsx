import { Camera, Download } from "lucide-react";

interface ExportPanelProps {
  onScreenshot?: () => void;
}

export function ExportPanel({ onScreenshot }: ExportPanelProps) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <h4 className="text-white font-medium mb-3">Export & Share</h4>

      <div className="space-y-3">
        <button
          onClick={onScreenshot}
          className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
              <Camera className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">Take Screenshot</p>
              <p className="text-xs text-gray-500">
                Capture current view as PNG
              </p>
            </div>
          </div>
        </button>

        <div className="opacity-50 cursor-not-allowed">
          <div className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-700/50 rounded-lg text-gray-500">
                <Download className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-400">Export GLB</p>
                <p className="text-xs text-gray-600">Download current scene</p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider bg-white/5 px-2 py-1 rounded text-gray-500">
              Soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
