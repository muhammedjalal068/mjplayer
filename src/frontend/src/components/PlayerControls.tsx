import type { AspectRatio } from "@/types/player";
import { useEffect, useRef, useState } from "react";
import { MoreOptionsMenu } from "./MoreOptionsMenu";
import { ProgressBar } from "./ProgressBar";
import { VolumeControl } from "./VolumeControl";

function formatTime(s: number, remaining?: boolean, duration?: number): string {
  if (Number.isNaN(s) || !Number.isFinite(s)) return "0:00";
  const t = remaining && duration ? duration - s : s;
  const prefix = remaining && duration ? "-" : "";
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const sec = Math.floor(t % 60);
  if (h > 0)
    return `${prefix}${h}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  return `${prefix}${m}:${sec.toString().padStart(2, "0")}`;
}

interface PlayerControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  buffered: number;
  loop: boolean;
  speed: number;
  aspectRatio: AspectRatio;
  brightness: number;
  contrast: number;
  showRemainingTime: boolean;
  onPlay: () => void;
  onRewind: () => void;
  onForward: () => void;
  onToggleMute: () => void;
  onVolumeChange: (v: number) => void;
  onSeek: (t: number) => void;
  onDragging: (d: boolean) => void;
  onToggleRemainingTime: () => void;
  onLoopToggle: () => void;
  onSpeedChange: (s: number) => void;
  onAspectChange: (a: AspectRatio) => void;
  onBrightnessChange: (v: number) => void;
  onContrastChange: (v: number) => void;
  onPip: () => void;
  onTheater: () => void;
  onFullscreen: () => void;
  isTheaterMode: boolean;
  visible: boolean;
  subtitleName: string | null;
  onLoadSubtitle: (file: File) => void;
  onClearSubtitle: () => void;
}

export function PlayerControls(props: PlayerControlsProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!moreOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        moreContainerRef.current &&
        !moreContainerRef.current.contains(e.target as Node)
      ) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [moreOpen]);

  const {
    isPlaying,
    isMuted,
    volume,
    currentTime,
    duration,
    buffered,
    loop,
    speed,
    aspectRatio,
    brightness,
    contrast,
    showRemainingTime,
    onPlay,
    onRewind,
    onForward,
    onToggleMute,
    onVolumeChange,
    onSeek,
    onDragging,
    onToggleRemainingTime,
    onLoopToggle,
    onSpeedChange,
    onAspectChange,
    onBrightnessChange,
    onContrastChange,
    onPip,
    onTheater,
    onFullscreen,
    isTheaterMode,
    visible,
    subtitleName,
    onLoadSubtitle,
    onClearSubtitle,
  } = props;

  return (
    <div
      className="absolute bottom-0 left-0 w-full px-4 sm:px-6 pb-6 pt-24 mj-glass-controls z-10 flex flex-col gap-4 transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
      data-ocid="player.controls"
    >
      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        buffered={buffered}
        onSeek={onSeek}
        onDragging={onDragging}
      />

      <div className="flex justify-between items-center mt-1">
        {/* Left controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={onPlay}
            data-tooltip={isPlaying ? "Pause (k)" : "Play (k)"}
            data-ocid="player.play_button"
            className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-all hover:bg-white/20"
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)",
            }}
          >
            <i
              className={`fa-solid ${isPlaying ? "fa-pause" : "fa-play"} text-xl ${!isPlaying ? "ml-1" : ""}`}
            />
          </button>
          <button
            type="button"
            onClick={onRewind}
            data-tooltip="Rewind 10s (j)"
            data-ocid="player.rewind_button"
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <i className="fa-solid fa-rotate-left" />
          </button>
          <button
            type="button"
            onClick={onForward}
            data-tooltip="Forward 10s (l)"
            data-ocid="player.forward_button"
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <i className="fa-solid fa-rotate-right" />
          </button>

          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            onToggleMute={onToggleMute}
            onVolumeChange={onVolumeChange}
          />

          {/* Time display */}
          <div
            className="text-xs sm:text-sm font-medium text-gray-300 font-mono tracking-wide ml-2 px-3 py-1.5 rounded-lg border border-gray-700/30"
            style={{ background: "rgba(0,0,0,0.3)" }}
          >
            <span data-ocid="player.current_time">
              {formatTime(currentTime)}
            </span>
            <span className="text-gray-500 mx-1">/</span>
            <button
              type="button"
              className="cursor-pointer hover:text-white transition-colors bg-transparent border-0 p-0 text-gray-300 font-mono"
              data-tooltip="Toggle Remaining Time"
              data-ocid="player.duration_display"
              onClick={onToggleRemainingTime}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onToggleRemainingTime();
                }
              }}
            >
              {formatTime(currentTime, showRemainingTime, duration)}
            </button>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* More options */}
          <div className="relative" ref={moreContainerRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMoreOpen((v) => !v);
              }}
              data-tooltip="More Options"
              data-ocid="player.more_options_button"
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-all"
            >
              <i className="fa-solid fa-ellipsis-vertical text-xl" />
            </button>
            {moreOpen && (
              <MoreOptionsMenu
                loop={loop}
                speed={speed}
                aspectRatio={aspectRatio}
                brightness={brightness}
                contrast={contrast}
                subtitleName={subtitleName}
                onLoopToggle={onLoopToggle}
                onSpeedChange={onSpeedChange}
                onAspectChange={onAspectChange}
                onBrightnessChange={onBrightnessChange}
                onContrastChange={onContrastChange}
                onLoadSubtitle={onLoadSubtitle}
                onClearSubtitle={onClearSubtitle}
              />
            )}
          </div>

          <button
            type="button"
            onClick={onPip}
            data-tooltip="Picture-in-Picture (p)"
            data-ocid="player.pip_button"
            className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <i className="fa-solid fa-clone" />
          </button>
          <button
            type="button"
            onClick={onTheater}
            data-tooltip="Theater Mode (t)"
            data-ocid="player.theater_button"
            className={`hidden sm:flex w-10 h-10 rounded-full items-center justify-center hover:bg-white/10 transition-all ${isTheaterMode ? "text-theme-500" : "text-gray-300 hover:text-white"}`}
          >
            <i className="fa-solid fa-tv" />
          </button>
          <button
            type="button"
            onClick={onFullscreen}
            data-tooltip="Fullscreen (f)"
            data-ocid="player.fullscreen_button"
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <i className="fa-solid fa-expand text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}
