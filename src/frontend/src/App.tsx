import { ActionIndicator } from "@/components/ActionIndicator";
import { GlobalHeader } from "@/components/GlobalHeader";
import { GlobalSettingsModal } from "@/components/GlobalSettingsModal";
import { IosInstallModal } from "@/components/IosInstallModal";
import { LibrarySidebar } from "@/components/LibrarySidebar";
import { OSD } from "@/components/OSD";
import { PlayerControls } from "@/components/PlayerControls";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { useMediaPlayer } from "@/hooks/useMediaPlayer";
import { usePWA } from "@/hooks/usePWA";
import { useSettings } from "@/hooks/useSettings";
import type { AspectRatio } from "@/types/player";
import { useCallback, useEffect, useRef, useState } from "react";

export default function App() {
  // OSD state
  const [osdText, setOsdText] = useState("");
  const [osdIcon, setOsdIcon] = useState("fa-info-circle");
  const [osdVisible, setOsdVisible] = useState(false);
  const osdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Center action indicator
  const [actionIcon, setActionIcon] = useState("fa-play");
  const [actionTrigger, setActionTrigger] = useState(0);

  // UI state
  const [controlsVisible, setControlsVisible] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryFiles, setLibraryFiles] = useState<File[]>([]);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isPseudoFullscreen, setIsPseudoFullscreen] = useState(false);
  const [recentFiles, setRecentFiles] = useState<File[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const hideControlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const positionThrottleRef = useRef(0);

  // OSD helper
  const showOSD = useCallback((text: string, icon: string) => {
    setOsdText(text);
    setOsdIcon(icon);
    setOsdVisible(true);
    if (osdTimeoutRef.current) clearTimeout(osdTimeoutRef.current);
    osdTimeoutRef.current = setTimeout(() => setOsdVisible(false), 2000);
  }, []);

  // Ping helper
  const pingCenter = useCallback((icon: string) => {
    setActionIcon(icon);
    setActionTrigger((v) => v + 1);
  }, []);

  const player = useMediaPlayer(showOSD, pingCenter);
  const pwa = usePWA();
  const {
    settings,
    updateSetting,
    savePosition,
    getSavedPosition,
    clearAllData,
  } = useSettings();

  // Auto-hide controls timer
  const resetHideTimer = useCallback(() => {
    if (hideControlsTimerRef.current)
      clearTimeout(hideControlsTimerRef.current);
    setControlsVisible(true);
    setHeaderVisible(true);

    if (!player.isPlaying) return;

    hideControlsTimerRef.current = setTimeout(() => {
      setControlsVisible(false);
      setHeaderVisible(false);
    }, 2500);
  }, [player.isPlaying]);

  useEffect(() => {
    if (!player.isPlaying) {
      setControlsVisible(true);
      setHeaderVisible(true);
      if (hideControlsTimerRef.current)
        clearTimeout(hideControlsTimerRef.current);
    } else {
      resetHideTimer();
    }
  }, [player.isPlaying, resetHideTimer]);

  // Add to recent files when a new file loads + resume position
  useEffect(() => {
    const file = player.currentFile;
    if (!file) return;
    setRecentFiles((prev) => {
      const filtered = prev.filter((f) => f.name !== file.name);
      return [file, ...filtered].slice(0, 5);
    });
    // Resume saved position
    if (settings.resume) {
      const saved = getSavedPosition(file.name);
      const vid = player.videoRef.current;
      if (saved !== null && vid) {
        vid.currentTime = saved;
        showOSD("Resumed Playback", "fa-clock-rotate-left");
      }
    }
  }, [
    player.currentFile,
    player.videoRef,
    settings.resume,
    getSavedPosition,
    showOSD,
  ]);

  // Load media file
  const handleFileSelect = useCallback(
    (file: File) => {
      player.loadMediaFile(file);
      if (libraryOpen && window.innerWidth < 640) setLibraryOpen(false);
    },
    [player, libraryOpen],
  );

  // Folder select -> library
  const handleFolderSelect = useCallback(
    (files: FileList) => {
      const validExts = [
        ".mp4",
        ".mkv",
        ".avi",
        ".mov",
        ".webm",
        ".mp3",
        ".wav",
        ".flac",
        ".aac",
        ".m4a",
        ".ogg",
      ];
      const media = Array.from(files).filter((f) => {
        if (f.type.startsWith("video/") || f.type.startsWith("audio/"))
          return true;
        const name = f.name.toLowerCase();
        return validExts.some((ext) => name.endsWith(ext));
      });
      if (media.length === 0) {
        showOSD("No media files found", "fa-triangle-exclamation");
        return;
      }
      media.sort((a, b) => a.name.localeCompare(b.name));
      setLibraryFiles(media);
      setLibraryOpen(true);
      showOSD(`Loaded ${media.length} media files`, "fa-folder-open");
    },
    [showOSD],
  );

  // Volume helpers
  const handleVolumeChange = useCallback(
    (v: number) => {
      player.setVolume(v);
      player.setIsMuted(false);
      player.updateVolumeState(v, false);
      showOSD(`Volume: ${Math.round(v * 100)}%`, "fa-volume-high");
    },
    [player, showOSD],
  );

  const handleToggleMute = useCallback(() => {
    const newMuted = !player.isMuted;
    player.setIsMuted(newMuted);
    if (player.videoRef.current) player.videoRef.current.muted = newMuted;
    player.updateVolumeState(player.volume, newMuted);
    showOSD(
      newMuted ? "Muted" : `Volume: ${Math.round(player.volume * 100)}%`,
      newMuted ? "fa-volume-xmark" : "fa-volume-high",
    );
  }, [player, showOSD]);

  // Seek
  const handleSeek = useCallback(
    (time: number) => {
      if (player.videoRef.current) {
        player.videoRef.current.currentTime = time;
        player.setCurrentTime(time);
      }
    },
    [player],
  );

  // Loop
  const handleLoopToggle = useCallback(() => {
    const newLoop = !player.loop;
    player.setLoop(newLoop);
    if (player.videoRef.current) player.videoRef.current.loop = newLoop;
    showOSD(newLoop ? "Loop: On" : "Loop: Off", "fa-repeat");
  }, [player, showOSD]);

  // Speed
  const handleSpeedChange = useCallback(
    (s: number) => {
      player.setSpeed(s);
      if (player.videoRef.current) player.videoRef.current.playbackRate = s;
      showOSD(`Speed: ${s}x`, "fa-gauge-high");
    },
    [player, showOSD],
  );

  // Aspect ratio
  const handleAspectChange = useCallback(
    (a: AspectRatio) => {
      player.setAspectRatio(a);
      const labels: Record<AspectRatio, string> = {
        contain: "Fit",
        cover: "Fill",
        fill: "Stretch",
      };
      showOSD(`Aspect: ${labels[a]}`, "fa-crop-simple");
    },
    [player, showOSD],
  );

  // Brightness/contrast
  const handleBrightnessChange = useCallback(
    (v: number) => {
      player.setBrightness(v);
      if (player.videoRef.current) {
        player.videoRef.current.style.filter = `brightness(${v}%) contrast(${player.contrast}%)`;
      }
      showOSD(`Brightness: ${v}%`, "fa-sun");
    },
    [player, showOSD],
  );

  const handleContrastChange = useCallback(
    (v: number) => {
      player.setContrast(v);
      if (player.videoRef.current) {
        player.videoRef.current.style.filter = `brightness(${player.brightness}%) contrast(${v}%)`;
      }
      showOSD(`Contrast: ${v}%`, "fa-circle-half-stroke");
    },
    [player, showOSD],
  );

  // PiP
  const handlePip = useCallback(async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled && player.videoRef.current) {
        await player.videoRef.current.requestPictureInPicture();
      }
    } catch {
      showOSD("PiP not supported", "fa-circle-xmark");
    }
  }, [player, showOSD]);

  // Theater
  const handleTheater = useCallback(() => {
    const next = !isTheaterMode;
    setIsTheaterMode(next);
    showOSD(next ? "Theater Mode" : "Default View", "fa-tv");
  }, [isTheaterMode, showOSD]);

  // Fullscreen
  const handleFullscreen = useCallback(() => {
    const mc = mainContainerRef.current;
    if (!mc) return;
    if (!document.fullscreenElement && !isPseudoFullscreen) {
      if (document.fullscreenEnabled) {
        mc.requestFullscreen().catch(() => {
          setIsPseudoFullscreen(true);
          showOSD("Fullscreen (Window)", "fa-expand");
        });
      } else {
        setIsPseudoFullscreen(true);
        showOSD("Fullscreen (Window)", "fa-expand");
      }
    } else {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      if (isPseudoFullscreen) {
        setIsPseudoFullscreen(false);
        showOSD("Exit Fullscreen", "fa-compress");
      }
    }
  }, [isPseudoFullscreen, showOSD]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: event-listener effect, ref stable
  useEffect(() => {
    const video = player.videoRef.current;
    if (!video) return;
    const handler = () => {
      if (!settings.autoplay || libraryFiles.length === 0) return;
      const currentName = player.currentFile?.name ?? "";
      const idx = libraryFiles.findIndex((f) => f.name === currentName);
      if (idx !== -1 && idx + 1 < libraryFiles.length) {
        showOSD("Playing Next File...", "fa-forward-step");
        setTimeout(() => player.loadMediaFile(libraryFiles[idx + 1]), 1500);
      }
    };
    video.addEventListener("ended", handler);
    return () => video.removeEventListener("ended", handler);
  }, [settings.autoplay, libraryFiles, player.currentFile]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: event-listener effect, ref stable
  useEffect(() => {
    const video = player.videoRef.current;
    if (!video) return;
    const handler = () => {
      if (!settings.resume || video.paused || video.currentTime <= 5) return;
      const now = Date.now();
      if (now - positionThrottleRef.current > 1000) {
        positionThrottleRef.current = now;
        savePosition(player.currentFile?.name ?? "", video.currentTime);
      }
    };
    video.addEventListener("timeupdate", handler);
    return () => video.removeEventListener("timeupdate", handler);
  }, [settings.resume, player.currentFile, savePosition]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: event-listener effect, ref stable
  useEffect(() => {
    const handler = () => {
      const video = player.videoRef.current;
      if (
        document.hidden &&
        video &&
        !video.paused &&
        settings.pipAuto &&
        document.pictureInPictureEnabled &&
        !document.pictureInPictureElement
      ) {
        video.requestPictureInPicture().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [settings.pipAuto]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: event-listener effect, ref stable
  useEffect(() => {
    const video = player.videoRef.current;
    if (!video) return;
    // Remove old subtitle tracks
    for (const t of video.querySelectorAll('track[kind="subtitles"]')) {
      t.remove();
    }
    if (player.subtitleUrl) {
      const track = document.createElement("track");
      track.kind = "subtitles";
      track.label = player.subtitleName ?? "Subtitles";
      track.srclang = "en";
      track.src = player.subtitleUrl;
      track.default = true;
      video.appendChild(track);
    }
  }, [player.subtitleUrl, player.subtitleName]);

  // EQ apply helper for settings modal
  const handleApplyEQ = useCallback(
    (bass: number, treble: number, enabled: boolean) => {
      player.applyEQ(bass, treble, enabled);
    },
    [player],
  );

  // Back to welcome
  const handleBack = useCallback(() => {
    const v = player.videoRef.current;
    if (v) {
      v.pause();
      v.src = "";
    }
    player.setCurrentFile(null);
    player.setIsPlaying(false);
    player.setCurrentTime(0);
    player.setDuration(0);
    document.title = "Mj Player";
  }, [player]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      if (!player.currentFile) return;

      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          player.togglePlay();
          resetHideTimer();
          break;
        case "j":
        case "arrowleft":
          e.preventDefault();
          player.skipTime(-10);
          resetHideTimer();
          break;
        case "l":
        case "arrowright":
          e.preventDefault();
          player.skipTime(10);
          resetHideTimer();
          break;
        case "arrowup":
          e.preventDefault();
          {
            const nv = Math.min(2, player.volume + 0.1);
            player.setVolume(nv);
            player.setIsMuted(false);
            player.updateVolumeState(nv, false);
            showOSD(`Volume: ${Math.round(nv * 100)}%`, "fa-volume-high");
            resetHideTimer();
          }
          break;
        case "arrowdown":
          e.preventDefault();
          {
            const nv = Math.max(0, player.volume - 0.1);
            player.setVolume(nv);
            player.setIsMuted(false);
            player.updateVolumeState(nv, false);
            showOSD(`Volume: ${Math.round(nv * 100)}%`, "fa-volume-high");
            resetHideTimer();
          }
          break;
        case "m":
          e.preventDefault();
          handleToggleMute();
          resetHideTimer();
          break;
        case "f":
          e.preventDefault();
          handleFullscreen();
          resetHideTimer();
          break;
        case "p":
          e.preventDefault();
          handlePip();
          resetHideTimer();
          break;
        case "t":
          e.preventDefault();
          handleTheater();
          resetHideTimer();
          break;
        case ",":
          e.preventDefault();
          if (player.videoRef.current) {
            player.videoRef.current.pause();
            player.videoRef.current.currentTime -= 1 / 30;
          }
          showOSD("Frame Step Back", "fa-backward-step");
          break;
        case ".":
          e.preventDefault();
          if (player.videoRef.current) {
            player.videoRef.current.pause();
            player.videoRef.current.currentTime += 1 / 30;
          }
          showOSD("Frame Step Forward", "fa-forward-step");
          break;
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [
    player,
    showOSD,
    resetHideTimer,
    handleToggleMute,
    handleFullscreen,
    handlePip,
    handleTheater,
  ]);

  // Drop on video container
  const handleVideoDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files.length > 0)
        handleFileSelect(e.dataTransfer.files[0]);
    },
    [handleFileSelect],
  );

  const hasMedia = !!player.currentFile;

  const aspectClass = {
    contain: "object-contain",
    cover: "object-cover",
    fill: "object-fill",
  }[player.aspectRatio];

  return (
    <div
      className={`bg-black text-white h-screen w-screen overflow-hidden flex flex-col select-none ${
        isPseudoFullscreen ? "fixed inset-0 z-[100]" : ""
      } ${isTheaterMode && !isPseudoFullscreen ? "fixed inset-0 z-50" : ""}`}
    >
      {/* Global Header */}
      <GlobalHeader
        visible={headerVisible || !hasMedia}
        recentFiles={recentFiles}
        onFileSelect={handleFileSelect}
        onClearRecent={() => setRecentFiles([])}
        onLibraryToggle={() => setLibraryOpen((v) => !v)}
        showInstallBtn={pwa.showInstallBtn}
        onInstall={pwa.handleInstall}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Container */}
      <main
        ref={mainContainerRef}
        className="flex-1 relative flex flex-col overflow-hidden w-full h-full"
        style={{ background: "#0a0a0c" }}
      >
        {/* Welcome Screen */}
        {!hasMedia && (
          <WelcomeScreen
            onFileSelect={handleFileSelect}
            onFolderSelect={handleFolderSelect}
            showInstallBtn={pwa.showInstallBtn}
            onInstall={pwa.handleInstall}
            username={settings.username}
          />
        )}

        {/* Video Container */}
        {hasMedia && (
          <div
            className={`relative w-full h-full flex justify-center items-center flex-col${!controlsVisible ? " mj-hide-cursor" : ""}`}
            style={{ background: "#000" }}
            onMouseMove={resetHideTimer}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleVideoDrop}
          >
            <video
              ref={player.videoRef}
              className={`w-full h-full ${aspectClass}`}
              preload="metadata"
              onDoubleClick={handleFullscreen}
              onClick={player.togglePlay}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  player.togglePlay();
                }
              }}
            >
              <track kind="captions" />
            </video>

            {/* Action indicator */}
            <ActionIndicator icon={actionIcon} triggerAt={actionTrigger} />

            {/* OSD */}
            <OSD text={osdText} icon={osdIcon} visible={osdVisible} />

            {/* Top bar overlay */}
            <div
              className="absolute top-0 left-0 w-full p-6 pt-24 pointer-events-none z-10 flex justify-between items-start transition-opacity duration-300"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)",
                opacity: controlsVisible ? 1 : 0,
              }}
            >
              <div className="pointer-events-auto max-w-2xl flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  data-tooltip="Close Video"
                  data-ocid="player.back_button"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:bg-theme-500"
                  style={{
                    background: "rgba(0,0,0,0.4)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <i className="fa-solid fa-arrow-left text-lg" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-white drop-shadow-md truncate tracking-tight max-w-lg">
                    {player.currentFile?.name ?? ""}
                  </h2>
                  <p className="text-gray-300 text-sm mt-1 drop-shadow font-medium flex items-center gap-2">
                    <i className="fa-solid fa-play fa-2xs text-theme-500" /> Now
                    Playing
                  </p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <PlayerControls
              isPlaying={player.isPlaying}
              isMuted={player.isMuted}
              volume={player.volume}
              currentTime={player.currentTime}
              duration={player.duration}
              buffered={player.buffered}
              loop={player.loop}
              speed={player.speed}
              aspectRatio={player.aspectRatio}
              brightness={player.brightness}
              contrast={player.contrast}
              showRemainingTime={player.showRemainingTime}
              visible={controlsVisible}
              isTheaterMode={isTheaterMode}
              subtitleName={player.subtitleName}
              onPlay={player.togglePlay}
              onRewind={() => player.skipTime(-10)}
              onForward={() => player.skipTime(10)}
              onToggleMute={handleToggleMute}
              onVolumeChange={handleVolumeChange}
              onSeek={handleSeek}
              onDragging={player.setIsDraggingProgress}
              onToggleRemainingTime={() =>
                player.setShowRemainingTime(!player.showRemainingTime)
              }
              onLoopToggle={handleLoopToggle}
              onSpeedChange={handleSpeedChange}
              onAspectChange={handleAspectChange}
              onBrightnessChange={handleBrightnessChange}
              onContrastChange={handleContrastChange}
              onPip={handlePip}
              onTheater={handleTheater}
              onFullscreen={handleFullscreen}
              onLoadSubtitle={player.loadSubtitle}
              onClearSubtitle={player.clearSubtitle}
            />
          </div>
        )}
      </main>

      {/* Library sidebar */}
      <LibrarySidebar
        isOpen={libraryOpen}
        files={libraryFiles}
        currentFileName={player.currentFile?.name ?? ""}
        onClose={() => setLibraryOpen(false)}
        onFileSelect={handleFileSelect}
        onFolderSelect={handleFolderSelect}
      />

      {/* iOS install modal */}
      <IosInstallModal
        visible={pwa.showIosModal}
        onClose={() => pwa.setShowIosModal(false)}
      />

      {/* Global Settings Modal */}
      <GlobalSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSetting={updateSetting}
        onClearData={clearAllData}
        onApplyEQ={handleApplyEQ}
      />
    </div>
  );
}
