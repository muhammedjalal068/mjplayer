import { useRef, useState } from "react";

function formatTime(seconds: number): string {
  if (Number.isNaN(seconds) || !Number.isFinite(seconds)) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0)
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  buffered: number; // percentage 0-100
  onSeek: (time: number) => void;
  onDragging: (dragging: boolean) => void;
}

export function ProgressBar({
  currentTime,
  duration,
  buffered,
  onSeek,
  onDragging,
}: ProgressBarProps) {
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const percent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const getTimeFromEvent = (e: React.MouseEvent | MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !duration) return 0;
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    return pos * duration;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const time = getTimeFromEvent(e);
    setHoverTime(time);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      let x = e.clientX - rect.left;
      x = Math.max(20, Math.min(x, rect.width - 20));
      setHoverX(x);
    }
  };

  const onMouseLeave = () => setHoverTime(null);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    onDragging(true);
    const time = getTimeFromEvent(e);
    onSeek(time);

    const onMove = (ev: MouseEvent) => {
      const t = getTimeFromEvent(ev);
      onSeek(t);
    };
    const onUp = (ev: MouseEvent) => {
      onSeek(getTimeFromEvent(ev));
      onDragging(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div
      ref={containerRef}
      className="w-full relative mj-progress-container cursor-pointer py-2"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      data-ocid="player.progress_bar"
    >
      <div
        className="w-full h-1 rounded-full relative mj-progress-bar overflow-hidden"
        style={{ background: "rgba(255,255,255,0.15)" }}
      >
        {/* Buffer */}
        <div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{
            width: `${buffered}%`,
            background: "rgba(156,163,175,0.3)",
            transition: "width 0.2s",
          }}
        />
        {/* Progress */}
        <div
          className="absolute top-0 left-0 h-full rounded-full pointer-events-none"
          style={{
            width: `${percent}%`,
            background:
              "linear-gradient(to right, var(--theme-400), var(--theme-500))",
          }}
        />
      </div>
      {/* Scrub thumb */}
      <div
        className="mj-progress-thumb absolute top-1/2 -mt-2.5 w-5 h-5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] border-2 border-theme-500 pointer-events-none"
        style={{
          left: `${percent}%`,
          transform: "translateX(-50%) scale(0)",
          background: "#ffffff",
        }}
      />
      {/* Hover tooltip */}
      {hoverTime !== null && (
        <div
          className="absolute bottom-full mb-3 px-3 py-1.5 text-white text-xs rounded-md shadow-lg font-mono border border-gray-700/50 pointer-events-none z-50"
          style={{
            left: `${hoverX}px`,
            transform: "translateX(-50%)",
            background: "rgba(17,24,39,0.97)",
            backdropFilter: "blur(8px)",
          }}
        >
          {formatTime(hoverTime)}
        </div>
      )}
    </div>
  );
}
