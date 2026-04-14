import { ViewerSettings } from '@/lib/types/3d';

interface LODPanelProps {
  currentSettings: ViewerSettings;
  onLodChange?: (lod: { enabled?: boolean; quality?: 'auto' | 'high' | 'medium' | 'low' }) => void;
}

export function LODPanel({ currentSettings, onLodChange }: LODPanelProps) {
  const { enabled = true, quality = 'auto' } = currentSettings.lod || {};

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <h4 className="text-white font-medium mb-3">Level of Detail</h4>

      <div className="space-y-3">
        {/* Toggle LOD */}
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
          <span className="text-sm text-gray-300">Enable LOD</span>
          <button
            onClick={() => onLodChange?.({ enabled: !enabled })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              enabled ? 'bg-blue-600' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Quality Selection */}
        {enabled && (
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Quality Preference</label>
            <div className="grid grid-cols-2 gap-2">
              {['auto', 'high', 'medium', 'low'].map(q => (
                <button
                  key={q}
                  onClick={() =>
                    onLodChange?.({ quality: q as 'auto' | 'high' | 'medium' | 'low' })
                  }
                  className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                    quality === q
                      ? 'bg-blue-600/20 border-blue-500/50 text-blue-200'
                      : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="capitalize">{q}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
