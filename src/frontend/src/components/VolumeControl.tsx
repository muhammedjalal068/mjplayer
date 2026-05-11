interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onVolumeChange: (v: number) => void;
}

export function VolumeControl({
  volume,
  isMuted,
  onToggleMute,
  onVolumeChange,
}: VolumeControlProps) {
  const displayVol = isMuted ? 0 : volume;
  const fillWidth = (displayVol / 2) * 100;

  let volIcon = "fa-volume-high";
  let volColor = "";
  if (isMuted || volume === 0) {
    volIcon = "fa-volume-xmark";
    volColor = "text-red-500";
  } else if (volume > 1.5) {
    volIcon = "fa-volume-high";
    volColor = "text-theme-500";
  } else if (volume < 0.5) {
    volIcon = "fa-volume-low";
  }

  return (
    <div className="flex items-center gap-2 mj-volume-group relative ml-2">
      <button
        type="button"
        onClick={onToggleMute}
        data-tooltip="Mute (m)"
        data-ocid="player.mute_toggle"
        className={`text-white transition-colors w-8 h-8 rounded-full flex justify-center items-center hover:bg-white/10 ${volColor}`}
      >
        <i className={`fa-solid ${volIcon} text-lg`} />
      </button>
      <div className="mj-volume-slider-wrap flex items-center h-full">
        <div
          className="relative w-full h-1.5 rounded-full flex items-center"
          style={{ background: "rgba(255,255,255,0.2)", minWidth: "96px" }}
        >
          <div
            className="absolute left-0 h-full rounded-full pointer-events-none"
            style={{ width: `${fillWidth}%`, background: "var(--theme-500)" }}
          />
          <input
            type="range"
            min={0}
            max={2}
            step={0.01}
            value={displayVol}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 mj-hidden-thumb"
            data-ocid="player.volume_input"
            onChange={(e) => {
              onVolumeChange(Number.parseFloat(e.target.value));
            }}
          />
        </div>
      </div>
    </div>
  );
}
