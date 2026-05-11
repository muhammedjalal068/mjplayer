import type { AspectRatio } from "@/types/player";

interface MoreOptionsMenuProps {
  loop: boolean;
  speed: number;
  aspectRatio: AspectRatio;
  brightness: number;
  contrast: number;
  subtitleName: string | null;
  onLoopToggle: () => void;
  onSpeedChange: (s: number) => void;
  onAspectChange: (a: AspectRatio) => void;
  onBrightnessChange: (v: number) => void;
  onContrastChange: (v: number) => void;
  onLoadSubtitle: (file: File) => void;
  onClearSubtitle: () => void;
}

const SPEEDS = [
  { val: 0.5, label: "0.5x" },
  { val: 1, label: "Normal" },
  { val: 1.25, label: "1.25x" },
  { val: 1.5, label: "1.5x" },
  { val: 2, label: "2.0x" },
];
const ASPECTS: { val: AspectRatio; label: string }[] = [
  { val: "contain", label: "Fit" },
  { val: "cover", label: "Fill" },
  { val: "fill", label: "Stretch" },
];

export function MoreOptionsMenu({
  loop,
  speed,
  aspectRatio,
  brightness,
  contrast,
  subtitleName,
  onLoopToggle,
  onSpeedChange,
  onAspectChange,
  onBrightnessChange,
  onContrastChange,
  onLoadSubtitle,
  onClearSubtitle,
}: MoreOptionsMenuProps) {
  return (
    <div
      className="absolute bottom-full right-0 mb-4 w-72 border border-gray-700/50 rounded-2xl shadow-2xl z-50 overflow-hidden text-sm py-2 max-h-[65vh] overflow-y-auto custom-scrollbar flex flex-col"
      style={{
        background: "rgba(26,28,35,0.97)",
        backdropFilter: "blur(16px)",
      }}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {/* Loop */}
      <button
        type="button"
        onClick={onLoopToggle}
        data-ocid="player.loop_toggle"
        className="flex items-center justify-between px-5 py-3 hover:bg-white/10 text-gray-200 border-b border-gray-700/50 font-medium transition-colors"
      >
        <div className="flex items-center gap-3">
          <i className="fa-solid fa-repeat text-gray-400 w-4" /> Loop Playback
        </div>
        <i
          className={`fa-solid fa-check text-theme-500 transition-opacity ${loop ? "opacity-100" : "opacity-0"}`}
        />
      </button>

      {/* Custom Subtitles */}
      <div className="px-5 py-2 mt-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
        Custom Subtitles
      </div>
      <div className="px-5 pb-3 border-b border-gray-700/50">
        <label
          htmlFor="subtitleInputMenu"
          className="cursor-pointer flex items-center justify-center gap-2 w-full py-2 text-gray-300 rounded transition-all text-xs font-medium border border-gray-600 border-dashed hover:bg-white/10"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <i className="fa-solid fa-file-import" /> Load Subtitle (.srt/.vtt)
        </label>
        <input
          type="file"
          id="subtitleInputMenu"
          accept=".srt,.vtt"
          className="hidden"
          onChange={(e) =>
            e.target.files?.[0] && onLoadSubtitle(e.target.files[0])
          }
        />
        {subtitleName && (
          <div
            className="mt-2 flex items-center justify-between p-2 rounded border border-theme-500/30"
            style={{ background: "rgba(59,130,246,0.1)" }}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <i className="fa-regular fa-file-lines text-theme-400 text-xs" />
              <span className="text-xs text-theme-300 truncate font-medium">
                {subtitleName}
              </span>
            </div>
            <button
              type="button"
              data-ocid="player.clear_subtitle_button"
              onClick={onClearSubtitle}
              className="text-gray-400 hover:text-red-400 transition-colors px-1 py-0.5"
            >
              <i className="fa-solid fa-xmark text-xs" />
            </button>
          </div>
        )}
      </div>

      {/* Aspect Ratio */}
      <div className="px-5 py-2 mt-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
        Aspect Ratio
      </div>
      <div className="grid grid-cols-3 gap-2 px-4 mb-2">
        {ASPECTS.map((a) => (
          <button
            type="button"
            key={a.val}
            data-ocid={`player.aspect_${a.val}`}
            onClick={() => onAspectChange(a.val)}
            className={`rounded py-1.5 text-xs font-medium transition-colors border ${aspectRatio === a.val ? "text-theme-500 border-theme-500/30 bg-white/5" : "text-gray-300 border-transparent bg-white/5 hover:bg-white/10"}`}
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Video Effects */}
      <div className="px-5 py-2 mt-1 text-xs font-bold text-gray-500 uppercase tracking-wider">
        Video Effects
      </div>
      <div className="px-5 pb-3 border-b border-gray-700/50">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400">
            <i className="fa-solid fa-sun mr-2" />
            Brightness
          </span>
          <span className="text-xs text-gray-500 font-mono">{brightness}%</span>
        </div>
        <input
          type="range"
          min={50}
          max={200}
          value={brightness}
          className="mj-standard-slider w-full h-1"
          data-ocid="player.brightness_input"
          onChange={(e) => onBrightnessChange(Number.parseInt(e.target.value))}
        />
        <div className="flex items-center justify-between mb-1 mt-3">
          <span className="text-xs text-gray-400">
            <i className="fa-solid fa-circle-half-stroke mr-2" />
            Contrast
          </span>
          <span className="text-xs text-gray-500 font-mono">{contrast}%</span>
        </div>
        <input
          type="range"
          min={50}
          max={200}
          value={contrast}
          className="mj-standard-slider w-full h-1"
          data-ocid="player.contrast_input"
          onChange={(e) => onContrastChange(Number.parseInt(e.target.value))}
        />
      </div>

      {/* Playback Speed */}
      <div className="px-5 py-2 mt-1 text-xs font-bold text-gray-500 uppercase tracking-wider">
        Playback Speed
      </div>
      <div className="flex flex-col pb-1">
        {SPEEDS.map((s) => (
          <button
            type="button"
            key={s.val}
            data-ocid={`player.speed_${s.val}`}
            onClick={() => onSpeedChange(s.val)}
            className={`flex items-center justify-between px-5 py-2 hover:bg-white/10 transition-colors font-medium ${speed === s.val ? "text-theme-500 bg-white/5" : "text-gray-300"}`}
          >
            {s.label}{" "}
            <i
              className={`fa-solid fa-check ${speed === s.val ? "opacity-100" : "opacity-0"}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
