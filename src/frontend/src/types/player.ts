export type AspectRatio = "contain" | "cover" | "fill";

export type AccentColor = "blue" | "purple" | "emerald" | "rose";

export interface ThemeConfig {
  400: string;
  500: string;
  600: string;
  glow: string;
}

export interface SubtitleSettings {
  size: string; // '1rem' | '1.2rem' | '1.6rem' | '2rem'
  background: string; // 'transparent' | 'rgba(0,0,0,0.6)' | '#000000'
  color: string; // 'white' | 'yellow' | 'cyan'
}

export interface AppSettings {
  autoplay: boolean;
  resume: boolean;
  pipAuto: boolean;
  eqEnabled: boolean;
  eqBass: number; // -15 to 15
  eqTreble: number; // -15 to 15
  subtitle: SubtitleSettings;
  oled: boolean;
  accentColor: AccentColor;
  username: string;
}

export interface PlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number; // 0-2
  currentTime: number;
  duration: number;
  buffered: number;
  loop: boolean;
  speed: number;
  aspectRatio: AspectRatio;
  brightness: number; // 50-200
  contrast: number; // 50-200
  isFullscreen: boolean;
  isPseudoFullscreen: boolean;
  isTheaterMode: boolean;
  showRemainingTime: boolean;
}

export interface MediaFile {
  name: string;
  type: string;
  file: File;
}
