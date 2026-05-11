import { useCallback, useEffect, useState } from "react";
import type {
  AccentColor,
  AppSettings,
  SubtitleSettings,
} from "../types/player";

const THEMES: Record<
  AccentColor,
  { 400: string; 500: string; 600: string; glow: string }
> = {
  blue: {
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    glow: "rgba(59,130,246,0.4)",
  },
  purple: {
    400: "#c084fc",
    500: "#a855f7",
    600: "#9333ea",
    glow: "rgba(168,85,247,0.4)",
  },
  emerald: {
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
    glow: "rgba(16,185,129,0.4)",
  },
  rose: {
    400: "#fb7185",
    500: "#f43f5e",
    600: "#e11d48",
    glow: "rgba(244,63,94,0.4)",
  },
};

const DEFAULT_SETTINGS: AppSettings = {
  autoplay: false,
  resume: true,
  pipAuto: false,
  eqEnabled: true,
  eqBass: 0,
  eqTreble: 0,
  subtitle: { size: "1.2rem", background: "rgba(0,0,0,0.6)", color: "white" },
  oled: false,
  accentColor: "blue",
  username: "",
};

function loadFromStorage(): AppSettings {
  try {
    return {
      autoplay: localStorage.getItem("mj_autoplay") === "true",
      resume: localStorage.getItem("mj_resume") !== "false",
      pipAuto: localStorage.getItem("mj_pip_auto") === "true",
      eqEnabled: localStorage.getItem("mj_eq_enable") !== "false",
      eqBass: Number.parseFloat(localStorage.getItem("mj_eq_bass") ?? "0") || 0,
      eqTreble:
        Number.parseFloat(localStorage.getItem("mj_eq_treble") ?? "0") || 0,
      subtitle: {
        size: localStorage.getItem("mj_sub_size") ?? "1.2rem",
        background: localStorage.getItem("mj_sub_bg") ?? "rgba(0,0,0,0.6)",
        color: localStorage.getItem("mj_sub_color") ?? "white",
      },
      oled: localStorage.getItem("mj_oled") === "true",
      accentColor: (localStorage.getItem("mj_theme") as AccentColor) ?? "blue",
      username: localStorage.getItem("mj_username") ?? "",
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function useSettings() {
  const [settings, setSettingsState] = useState<AppSettings>(loadFromStorage);

  const applyTheme = useCallback((color: AccentColor) => {
    const t = THEMES[color];
    const root = document.documentElement;
    root.style.setProperty("--theme-400", t[400]);
    root.style.setProperty("--theme-500", t[500]);
    root.style.setProperty("--theme-600", t[600]);
    root.style.setProperty("--theme-glow", t.glow);
  }, []);

  const applyOled = useCallback((enabled: boolean) => {
    if (enabled) document.body.classList.add("oled-mode");
    else document.body.classList.remove("oled-mode");
  }, []);

  const applySubtitleStyles = useCallback((sub: SubtitleSettings) => {
    let el = document.getElementById(
      "mj-subtitle-styles",
    ) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = "mj-subtitle-styles";
      document.head.appendChild(el);
    }
    el.innerHTML = [
      "video::cue {",
      `  font-size: ${sub.size} !important;`,
      `  background-color: ${sub.background} !important;`,
      `  color: ${sub.color} !important;`,
      "  font-family: 'Inter', sans-serif !important;",
      "  border-radius: 4px !important;",
      "  padding: 4px 8px !important;",
      "  text-shadow: 1px 1px 2px black !important;",
      "}",
    ].join("\n");
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: mount-only effect to apply saved settings
  useEffect(() => {
    applyTheme(settings.accentColor);
    applyOled(settings.oled);
    applySubtitleStyles(settings.subtitle);
  }, []);

  const updateSetting = useCallback(
    <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
      setSettingsState((prev) => ({ ...prev, [key]: value }));
      switch (key) {
        case "autoplay":
          localStorage.setItem("mj_autoplay", String(value));
          break;
        case "resume":
          localStorage.setItem("mj_resume", String(value));
          break;
        case "pipAuto":
          localStorage.setItem("mj_pip_auto", String(value));
          break;
        case "eqEnabled":
          localStorage.setItem("mj_eq_enable", String(value));
          break;
        case "eqBass":
          localStorage.setItem("mj_eq_bass", String(value));
          break;
        case "eqTreble":
          localStorage.setItem("mj_eq_treble", String(value));
          break;
        case "username":
          localStorage.setItem("mj_username", value as string);
          break;
        case "oled":
          localStorage.setItem("mj_oled", String(value));
          applyOled(value as boolean);
          break;
        case "accentColor":
          localStorage.setItem("mj_theme", value as string);
          applyTheme(value as AccentColor);
          break;
        case "subtitle": {
          const sub = value as SubtitleSettings;
          localStorage.setItem("mj_sub_size", sub.size);
          localStorage.setItem("mj_sub_bg", sub.background);
          localStorage.setItem("mj_sub_color", sub.color);
          applySubtitleStyles(sub);
          break;
        }
      }
    },
    [applyTheme, applyOled, applySubtitleStyles],
  );

  const savePosition = useCallback((filename: string, time: number) => {
    if (time > 5) localStorage.setItem(`mj_pos_${filename}`, String(time));
  }, []);

  const getSavedPosition = useCallback((filename: string): number | null => {
    const val = localStorage.getItem(`mj_pos_${filename}`);
    return val && !Number.isNaN(Number.parseFloat(val))
      ? Number.parseFloat(val)
      : null;
  }, []);

  const clearAllData = useCallback(() => {
    localStorage.clear();
    window.location.reload();
  }, []);

  return {
    settings,
    updateSetting,
    savePosition,
    getSavedPosition,
    clearAllData,
    applySubtitleStyles,
  };
}
