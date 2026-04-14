import { ControlsPanelProps } from '@/lib/types';
import { Play, Pause } from 'lucide-react';

interface AnimationsPanelProps {
  currentSettings: NonNullable<ControlsPanelProps['currentSettings']>;
  onAnimationPlay?: () => void;
  onAnimationPause?: () => void;
  onAnimationSelect?: (name: string) => void;
}

export function AnimationsPanel({
  currentSettings,
  onAnimationPlay,
  onAnimationPause,
  onAnimationSelect,
}: AnimationsPanelProps) {
  const { available, current, isPlaying } = currentSettings.animations || {};

  if (!available || available.length === 0) {
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
        <h4 className="text-white font-medium mb-3">Animations</h4>
        <div className="text-gray-500 text-sm py-4 bg-gray-800/50 rounded-lg text-center border border-white/5">
          No animations found in model
        </div>
      </div>
    );
  }

  const handlePlay = () => onAnimationPlay?.();
  const handlePause = () => onAnimationPause?.();
  const handleSelect = (name: string) => onAnimationSelect?.(name);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <h4 className="text-white font-medium mb-3">Animations</h4>

      <div className="space-y-3">
        {/* Controls */}
        <div className="flex items-center justify-center gap-4 bg-white/5 p-3 rounded-lg border border-white/5">
          <button
            onClick={isPlaying ? handlePause : handlePlay}
            className="p-3 bg-blue-600 hover:bg-blue-500 rounded-full text-white transition-all hover:scale-110 active:scale-95 shadow-lg shadow-blue-900/20"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>
        </div>

        {/* Animation List */}
        <div className="space-y-2">
          <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">
            Available Clips
          </label>
          <div className="grid gap-2 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
            {available.map((anim: any) => {
              // Ensure anim is string, although type definition says any[] in ViewerSettings
              const animName = typeof anim === 'string' ? anim : anim.name || String(anim);
              return (
                <button
                  key={animName}
                  onClick={() => handleSelect(animName)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all border ${
                    current === animName
                      ? 'bg-blue-600/20 border-blue-500/50 text-blue-200'
                      : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{animName}</span>
                    {current === animName && isPlaying && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
