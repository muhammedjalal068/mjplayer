import type { AccentColor, AppSettings } from "@/types/player";
import { useEffect, useRef, useState } from "react";
import { MjLogo } from "./MjLogo";

interface GlobalSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSetting: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => void;
  onClearData: () => void;
  onApplyEQ: (bass: number, treble: number, enabled: boolean) => void;
}

type Tab =
  | "general"
  | "audio"
  | "subtitles"
  | "appearance"
  | "account"
  | "about";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "general", label: "General", icon: "fa-sliders" },
  { id: "audio", label: "Audio EQ", icon: "fa-music" },
  { id: "subtitles", label: "Subtitles", icon: "fa-closed-captioning" },
  { id: "appearance", label: "Appearance", icon: "fa-palette" },
  { id: "account", label: "Account", icon: "fa-user" },
  { id: "about", label: "About", icon: "fa-circle-info" },
];

const ACCENT_COLORS: { key: AccentColor; hex: string }[] = [
  { key: "blue", hex: "#3b82f6" },
  { key: "purple", hex: "#a855f7" },
  { key: "emerald", hex: "#10b981" },
  { key: "rose", hex: "#f43f5e" },
];

function Toggle({
  checked,
  onChange,
  id,
}: { checked: boolean; onChange: (v: boolean) => void; id: string }) {
  return (
    <label
      htmlFor={id}
      className="relative inline-flex items-center cursor-pointer shrink-0"
    >
      <input
        type="checkbox"
        id={id}
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-theme-500 shadow-inner" />
    </label>
  );
}

export function GlobalSettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSetting,
  onClearData,
  onApplyEQ,
}: GlobalSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const modalRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(false);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const eqLabel = (v: number) => `${v > 0 ? "+" : ""}${v} dB`;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4"
      style={{
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(4px)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s ease",
      }}
      onClick={(e) => {
        if (!modalRef.current?.contains(e.target as Node)) onClose();
      }}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      data-ocid="settings.dialog"
    >
      <div
        ref={modalRef}
        className="glass-modal w-full max-w-4xl flex flex-col overflow-hidden rounded-2xl shadow-2xl"
        style={{
          height: "85vh",
          maxHeight: "650px",
          transform: visible ? "scale(1)" : "scale(0.95)",
          transition: "transform 0.2s ease",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex justify-between items-center p-5 border-b border-gray-700/50 shrink-0"
          style={{ background: "rgba(0,0,0,0.4)" }}
        >
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-theme-500/20 flex items-center justify-center text-theme-500">
              <i className="fa-solid fa-gear" />
            </div>
            Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            data-ocid="settings.close_button"
            className="text-gray-400 hover:text-white transition-colors w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <i className="fa-solid fa-xmark text-lg" />
          </button>
        </div>

        {/* Body */}
        <div
          className="flex flex-1 overflow-hidden flex-col sm:flex-row"
          style={{ background: "#0f1115" }}
        >
          {/* Tab Sidebar */}
          <div
            className="w-full sm:w-64 flex sm:flex-col overflow-x-auto sm:overflow-y-auto custom-scrollbar p-3 gap-1 shrink-0 sm:border-r border-gray-700/50 border-b sm:border-b-0"
            style={{ background: "#14161c" }}
          >
            {TABS.map((tab) => (
              <button
                type="button"
                key={tab.id}
                data-ocid={`settings.tab.${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3.5 rounded-xl text-sm text-left flex items-center gap-3 transition-colors shrink-0 ${
                  activeTab === tab.id
                    ? "bg-theme-500/20 text-theme-400 font-bold"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200 font-medium"
                }`}
              >
                <i className={`fa-solid ${tab.icon} w-5 text-center`} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8">
            {/* General */}
            {activeTab === "general" && (
              <div>
                <div className="settings-section-title">Playback</div>
                <div className="flex flex-col shadow-lg mb-8">
                  <div className="settings-list-item">
                    <div>
                      <div className="text-white font-medium mb-1">
                        Auto-play Next File
                      </div>
                      <div className="text-xs text-gray-400">
                        Automatically play the next file in your folder library.
                      </div>
                    </div>
                    <Toggle
                      id="setting-autoplay"
                      checked={settings.autoplay}
                      onChange={(v) => onUpdateSetting("autoplay", v)}
                    />
                  </div>
                  <div className="settings-list-item">
                    <div>
                      <div className="text-white font-medium mb-1">
                        Resume Playback Position
                      </div>
                      <div className="text-xs text-gray-400">
                        Remember timestamps for recently watched files.
                      </div>
                    </div>
                    <Toggle
                      id="setting-resume"
                      checked={settings.resume}
                      onChange={(v) => onUpdateSetting("resume", v)}
                    />
                  </div>
                </div>
                <div className="settings-section-title">Interface Behavior</div>
                <div className="flex flex-col shadow-lg">
                  <div className="settings-list-item">
                    <div>
                      <div className="text-white font-medium mb-1">
                        Background PiP Auto-Open
                      </div>
                      <div className="text-xs text-gray-400">
                        Pop out the player if you switch browser tabs while
                        watching.
                      </div>
                    </div>
                    <Toggle
                      id="setting-pip-auto"
                      checked={settings.pipAuto}
                      onChange={(v) => onUpdateSetting("pipAuto", v)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Audio EQ */}
            {activeTab === "audio" && (
              <div>
                <div className="settings-section-title">Audio Equalizer</div>
                <div className="flex flex-col shadow-lg mb-8">
                  <div className="settings-list-item">
                    <div>
                      <div className="text-white font-medium mb-1">
                        Enable Custom EQ
                      </div>
                      <div className="text-xs text-gray-400">
                        Activate Web Audio API processing for Bass/Treble.
                      </div>
                    </div>
                    <Toggle
                      id="setting-eq-enable"
                      checked={settings.eqEnabled}
                      onChange={(v) => {
                        onUpdateSetting("eqEnabled", v);
                        onApplyEQ(settings.eqBass, settings.eqTreble, v);
                      }}
                    />
                  </div>
                  <div
                    className={`settings-list-item flex-col items-stretch py-5 ${
                      !settings.eqEnabled
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }`}
                  >
                    <div className="mb-5">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">
                          <i className="fa-solid fa-wave-square mr-2 text-gray-500" />
                          Bass Boost
                        </span>
                        <span className="text-theme-400 font-mono text-xs">
                          {eqLabel(settings.eqBass)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={-15}
                        max={15}
                        step={1}
                        value={settings.eqBass}
                        className="mj-standard-slider w-full h-1.5"
                        data-ocid="settings.eq_bass_input"
                        onChange={(e) => {
                          const v = Number.parseInt(e.target.value);
                          onUpdateSetting("eqBass", v);
                          onApplyEQ(v, settings.eqTreble, settings.eqEnabled);
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">
                          <i className="fa-solid fa-headphones mr-2 text-gray-500" />
                          Treble Boost
                        </span>
                        <span className="text-theme-400 font-mono text-xs">
                          {eqLabel(settings.eqTreble)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={-15}
                        max={15}
                        step={1}
                        value={settings.eqTreble}
                        className="mj-standard-slider w-full h-1.5"
                        data-ocid="settings.eq_treble_input"
                        onChange={(e) => {
                          const v = Number.parseInt(e.target.value);
                          onUpdateSetting("eqTreble", v);
                          onApplyEQ(settings.eqBass, v, settings.eqEnabled);
                        }}
                      />
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        data-ocid="settings.eq_reset_button"
                        className="text-xs hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors border border-gray-600"
                        style={{ background: "#1f2937" }}
                        onClick={() => {
                          onUpdateSetting("eqBass", 0);
                          onUpdateSetting("eqTreble", 0);
                          onApplyEQ(0, 0, settings.eqEnabled);
                        }}
                      >
                        Reset Sliders
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Subtitles */}
            {activeTab === "subtitles" && (
              <div>
                <div className="settings-section-title">
                  Subtitle Display Options
                </div>
                <div className="flex flex-col shadow-lg">
                  <div className="settings-list-item">
                    <div>
                      <div className="text-white font-medium mb-1">
                        Font Size
                      </div>
                      <div className="text-xs text-gray-400">
                        Adjust how large subtitles appear on screen.
                      </div>
                    </div>
                    <select
                      value={settings.subtitle.size}
                      className="bg-black/50 border border-gray-600 text-white text-sm rounded-lg p-2.5 outline-none w-full sm:w-auto focus:border-theme-500"
                      data-ocid="settings.subtitle_size_select"
                      onChange={(e) =>
                        onUpdateSetting("subtitle", {
                          ...settings.subtitle,
                          size: e.target.value,
                        })
                      }
                    >
                      <option value="1rem">Small</option>
                      <option value="1.2rem">Normal</option>
                      <option value="1.6rem">Large</option>
                      <option value="2rem">Extra Large</option>
                    </select>
                  </div>
                  <div className="settings-list-item">
                    <div>
                      <div className="text-white font-medium mb-1">
                        Background Style
                      </div>
                      <div className="text-xs text-gray-400">
                        Improve readability over bright videos.
                      </div>
                    </div>
                    <select
                      value={settings.subtitle.background}
                      className="bg-black/50 border border-gray-600 text-white text-sm rounded-lg p-2.5 outline-none w-full sm:w-auto focus:border-theme-500"
                      data-ocid="settings.subtitle_bg_select"
                      onChange={(e) =>
                        onUpdateSetting("subtitle", {
                          ...settings.subtitle,
                          background: e.target.value,
                        })
                      }
                    >
                      <option value="transparent">Transparent Text</option>
                      <option value="rgba(0,0,0,0.6)">
                        Semi-Transparent Box
                      </option>
                      <option value="#000000">Solid Black Box</option>
                    </select>
                  </div>
                  <div className="settings-list-item">
                    <div>
                      <div className="text-white font-medium mb-1">
                        Font Color
                      </div>
                    </div>
                    <select
                      value={settings.subtitle.color}
                      className="bg-black/50 border border-gray-600 text-white text-sm rounded-lg p-2.5 outline-none w-full sm:w-auto focus:border-theme-500"
                      data-ocid="settings.subtitle_color_select"
                      onChange={(e) =>
                        onUpdateSetting("subtitle", {
                          ...settings.subtitle,
                          color: e.target.value,
                        })
                      }
                    >
                      <option value="white">White</option>
                      <option value="yellow">Yellow</option>
                      <option value="cyan">Cyan</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance */}
            {activeTab === "appearance" && (
              <div>
                <div className="settings-section-title">
                  Theme Personalization
                </div>
                <div className="flex flex-col shadow-lg">
                  <div className="settings-list-item">
                    <div>
                      <div className="text-white font-medium mb-1">
                        OLED Dark Mode
                      </div>
                      <div className="text-xs text-gray-400">
                        Forces pure pitch-black backgrounds. Great for OLED
                        screens.
                      </div>
                    </div>
                    <Toggle
                      id="setting-oled"
                      checked={settings.oled}
                      onChange={(v) => onUpdateSetting("oled", v)}
                    />
                  </div>
                  <div className="settings-list-item">
                    <div>
                      <div className="text-white font-medium mb-1">
                        Accent Color
                      </div>
                      <div className="text-xs text-gray-400">
                        Change the main color used across the player UI.
                      </div>
                    </div>
                    <div className="flex gap-4 mt-3 sm:mt-0">
                      {ACCENT_COLORS.map((c) => (
                        <button
                          type="button"
                          key={c.key}
                          data-ocid={`settings.accent_color.${c.key}`}
                          onClick={() => onUpdateSetting("accentColor", c.key)}
                          className={`w-8 h-8 rounded-full cursor-pointer transition-transform ${
                            settings.accentColor === c.key
                              ? "ring-2 ring-white ring-offset-2 ring-offset-[#1a1c23] scale-110"
                              : "hover:scale-110"
                          }`}
                          style={{ background: c.hex }}
                          aria-label={`${c.key} accent`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Account */}
            {activeTab === "account" && (
              <div>
                <div className="settings-section-title">Local Profile</div>
                <div className="flex flex-col shadow-lg mb-8">
                  <div className="settings-list-item flex-col items-start py-5">
                    <div className="w-full flex items-center gap-4 mb-4">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-gray-500 text-2xl border border-gray-600 shadow-inner shrink-0"
                        style={{ background: "#1f2937" }}
                      >
                        <i className="fa-solid fa-user" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-400 mb-1">
                          Display Name
                        </div>
                        <input
                          type="text"
                          value={settings.username}
                          placeholder="Enter your name..."
                          maxLength={20}
                          data-ocid="settings.username_input"
                          className="w-full border border-gray-600 text-white text-sm rounded-lg p-2.5 outline-none transition-colors focus:border-theme-500"
                          style={{ background: "rgba(0,0,0,0.5)" }}
                          onChange={(e) =>
                            onUpdateSetting(
                              "username",
                              e.target.value.trimStart(),
                            )
                          }
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Your name will be displayed on the welcome screen. All
                      data remains saved locally on your device.
                    </p>
                  </div>
                  <button
                    type="button"
                    data-ocid="settings.clear_data_button"
                    className="settings-list-item cursor-pointer hover:bg-red-900/20 group w-full text-left"
                    onClick={() => {
                      if (
                        confirm(
                          "Are you sure you want to clear all settings and playback history?",
                        )
                      ) {
                        onClearData();
                      }
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <div className="text-red-400 font-medium mb-1 group-hover:text-red-300">
                          Clear All App Data
                        </div>
                        <div className="text-xs text-gray-500 group-hover:text-gray-400">
                          Reset settings, clear recent files, and wipe saved
                          playback positions.
                        </div>
                      </div>
                      <i className="fa-solid fa-trash-can text-gray-600 group-hover:text-red-400 transition-colors" />
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* About */}
            {activeTab === "about" && (
              <div className="flex flex-col items-center text-center mt-4">
                <MjLogo
                  size={80}
                  gradientId="mjAbout"
                  glowClass="drop-shadow-[0_0_15px_var(--theme-glow)] mb-4"
                />
                <h4 className="text-white font-bold text-2xl mb-1 tracking-tight">
                  Mj Player <span className="text-theme-500">Pro</span>
                </h4>
                <p
                  className="text-sm text-gray-400 mb-8 font-mono px-3 py-1 rounded-full border border-white/10"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  Version 3.0.0 (Web Edition)
                </p>
                <div className="w-full border-t border-gray-700/50 pt-6 text-left max-w-lg mx-auto">
                  <p className="text-sm text-gray-300 mb-5 leading-relaxed text-center">
                    Developed to provide a premium, privacy-focused local media
                    experience directly in your browser. No files are ever
                    uploaded to a server.
                  </p>
                  <div
                    className="rounded-xl p-5 shadow-inner"
                    style={{
                      background: "rgba(var(--theme-500-rgb, 59,130,246), 0.1)",
                      border:
                        "1px solid rgba(var(--theme-500-rgb, 59,130,246), 0.3)",
                    }}
                  >
                    <div
                      className="text-theme-400 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-2"
                      style={{ borderColor: "var(--theme-500)" }}
                    >
                      <i className="fa-solid fa-envelope" /> Contact &amp;
                      Support
                    </div>
                    <p className="text-sm text-gray-300 mt-1 mb-3 leading-relaxed">
                      For inquiries, bug reports, custom features, or general
                      support, please reach out directly at:
                    </p>
                    <div
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-700/50"
                      style={{ background: "rgba(0,0,0,0.4)" }}
                    >
                      <i className="fa-regular fa-envelope text-gray-400" />
                      <a
                        href="mailto:mhdjalal431@gmail.com"
                        className="text-white font-semibold hover:text-theme-400 transition-colors truncate"
                      >
                        mhdjalal431@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
