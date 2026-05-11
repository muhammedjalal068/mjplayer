import type { AspectRatio } from "@/types/player";
import { useCallback, useEffect, useRef, useState } from "react";

export interface UseMediaPlayerReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  audioCtxRef: React.RefObject<AudioContext | null>;
  gainNodeRef: React.RefObject<GainNode | null>;
  bassFilterRef: React.RefObject<BiquadFilterNode | null>;
  trebleFilterRef: React.RefObject<BiquadFilterNode | null>;
  isAudioInitialized: React.RefObject<boolean>;
  subtitleUrl: string | null;
  subtitleName: string | null;
  currentFile: File | null;
  recentFiles: File[];
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
  isDraggingProgress: boolean;
  setCurrentFile: (v: File | null) => void;
  setIsDraggingProgress: (v: boolean) => void;
  setIsPlaying: (v: boolean) => void;
  setIsMuted: (v: boolean) => void;
  setVolume: (v: number) => void;
  setCurrentTime: (v: number) => void;
  setDuration: (v: number) => void;
  setBuffered: (v: number) => void;
  setLoop: (v: boolean) => void;
  setSpeed: (v: number) => void;
  setAspectRatio: (v: AspectRatio) => void;
  setBrightness: (v: number) => void;
  setContrast: (v: number) => void;
  setShowRemainingTime: (v: boolean) => void;
  loadMediaFile: (file: File) => void;
  togglePlay: () => void;
  skipTime: (amount: number) => void;
  initAudio: () => void;
  resumeAudioContext: () => void;
  updateVolumeState: (vol: number, muted: boolean) => void;
  applyEQ: (bass: number, treble: number, enabled: boolean) => void;
  loadSubtitle: (file: File) => void;
  clearSubtitle: () => void;
}

export function useMediaPlayer(
  onOSD: (text: string, icon: string) => void,
  onPingCenter: (icon: string) => void,
): UseMediaPlayerReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const bassFilterRef = useRef<BiquadFilterNode | null>(null);
  const trebleFilterRef = useRef<BiquadFilterNode | null>(null);
  const subtitleUrlRef = useRef<string | null>(null);
  const isAudioInitialized = useRef(false);

  const [subtitleUrl, setSubtitleUrl] = useState<string | null>(null);
  const [subtitleName, setSubtitleName] = useState<string | null>(null);

  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [recentFiles, setRecentFiles] = useState<File[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [loop, setLoop] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("contain");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [showRemainingTime, setShowRemainingTime] = useState(false);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);

  const initAudio = useCallback(() => {
    const video = videoRef.current;
    if (isAudioInitialized.current || !video) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtx();
      const source = ctx.createMediaElementSource(video);
      const bass = ctx.createBiquadFilter();
      bass.type = "lowshelf";
      bass.frequency.value = 200;
      const treble = ctx.createBiquadFilter();
      treble.type = "highshelf";
      treble.frequency.value = 3000;
      const gain = ctx.createGain();
      source.connect(bass);
      bass.connect(treble);
      treble.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.value = 1.0;
      audioCtxRef.current = ctx;
      gainNodeRef.current = gain;
      bassFilterRef.current = bass;
      trebleFilterRef.current = treble;
      isAudioInitialized.current = true;
    } catch (e) {
      console.warn("AudioContext init failed:", e);
    }
  }, []);

  const resumeAudioContext = useCallback(() => {
    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }
  }, []);

  const updateVolumeState = useCallback((vol: number, muted: boolean) => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = muted ? 0 : vol;
    }
  }, []);

  const applyEQ = useCallback(
    (bass: number, treble: number, enabled: boolean) => {
      if (!bassFilterRef.current || !trebleFilterRef.current) return;
      bassFilterRef.current.gain.value = enabled ? bass : 0;
      trebleFilterRef.current.gain.value = enabled ? treble : 0;
    },
    [],
  );

  const loadSubtitle = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      let content = e.target?.result as string;
      if (file.name.toLowerCase().endsWith(".srt")) {
        content = `WEBVTT\n\n${content.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2")}`;
      }
      const blob = new Blob([content], { type: "text/vtt" });
      if (subtitleUrlRef.current) URL.revokeObjectURL(subtitleUrlRef.current);
      const url = URL.createObjectURL(blob);
      subtitleUrlRef.current = url;
      setSubtitleUrl(url);
      setSubtitleName(file.name);
    };
    reader.readAsText(file);
  }, []);

  const clearSubtitle = useCallback(() => {
    if (subtitleUrlRef.current) {
      URL.revokeObjectURL(subtitleUrlRef.current);
      subtitleUrlRef.current = null;
    }
    setSubtitleUrl(null);
    setSubtitleName(null);
    const video = videoRef.current;
    if (video) {
      for (const t of video.querySelectorAll("track")) {
        t.remove();
      }
    }
  }, []);

  const loadMediaFile = useCallback(
    (file: File) => {
      const video = videoRef.current;
      if (!video) return;

      const url = URL.createObjectURL(file);
      video.src = url;
      setCurrentFile(file);
      setCurrentTime(0);
      setDuration(0);
      setBuffered(0);
      setBrightness(100);
      setContrast(100);
      setAspectRatio("contain");
      setSpeed(1);
      video.playbackRate = 1;

      setRecentFiles((prev) => {
        const filtered = prev.filter((f) => f.name !== file.name);
        return [file, ...filtered].slice(0, 5);
      });

      initAudio();
      video.play().catch(() => {
        /* autoplay blocked */
      });
    },
    [initAudio],
  );

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    resumeAudioContext();
    if (video.paused) {
      video.play();
      onPingCenter("fa-play");
    } else {
      video.pause();
      onPingCenter("fa-pause");
    }
  }, [resumeAudioContext, onPingCenter]);

  const skipTime = useCallback(
    (amount: number) => {
      const video = videoRef.current;
      if (!video) return;
      video.currentTime += amount;
      const label = amount > 0 ? `+${amount}s` : `${amount}s`;
      onOSD(label, amount > 0 ? "fa-rotate-right" : "fa-rotate-left");
      onPingCenter(amount > 0 ? "fa-forward" : "fa-backward");
    },
    [onOSD, onPingCenter],
  );

  // Sync video events -> state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => {
      if (!isDraggingProgress) setCurrentTime(video.currentTime);
    };
    const onLoadedMetadata = () => setDuration(video.duration);
    const onProgress = () => {
      if (video.duration && video.buffered.length > 0) {
        setBuffered(
          (video.buffered.end(video.buffered.length - 1) / video.duration) *
            100,
        );
      }
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("progress", onProgress);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("progress", onProgress);
    };
  }, [isDraggingProgress]);

  return {
    videoRef,
    audioCtxRef,
    gainNodeRef,
    bassFilterRef,
    trebleFilterRef,
    isAudioInitialized,
    subtitleUrl,
    subtitleName,
    currentFile,
    recentFiles,
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
    isDraggingProgress,
    setCurrentFile,
    setIsDraggingProgress,
    setIsPlaying,
    setIsMuted,
    setVolume,
    setCurrentTime,
    setDuration,
    setBuffered,
    setLoop,
    setSpeed,
    setAspectRatio,
    setBrightness,
    setContrast,
    setShowRemainingTime,
    loadMediaFile,
    togglePlay,
    skipTime,
    initAudio,
    resumeAudioContext,
    updateVolumeState,
    applyEQ,
    loadSubtitle,
    clearSubtitle,
  };
}
