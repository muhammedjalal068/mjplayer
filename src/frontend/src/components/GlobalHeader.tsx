import { useRef, useState } from "react";
import { MjLogo } from "./MjLogo";

interface GlobalHeaderProps {
  visible: boolean;
  recentFiles: File[];
  onFileSelect: (file: File) => void;
  onClearRecent: () => void;
  onLibraryToggle: () => void;
  showInstallBtn: boolean;
  onInstall: () => void;
  onOpenSettings: () => void;
}

export function GlobalHeader({
  visible,
  recentFiles,
  onFileSelect,
  onClearRecent,
  onLibraryToggle,
  showInstallBtn,
  onInstall,
  onOpenSettings,
}: GlobalHeaderProps) {
  const [recentOpen, setRecentOpen] = useState(false);

  const handleOutside = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest("#recentMenuContainer")) setRecentOpen(false);
  };

  return (
    <header
      className="mj-glass-panel absolute top-0 w-full z-20 flex justify-between items-center px-4 h-[76px] transition-transform duration-500"
      style={{ transform: visible ? "translateY(0)" : "translateY(-100%)" }}
      onClick={handleOutside}
      onKeyDown={(e) => {
        if (e.key === "Escape") setRecentOpen(false);
      }}
    >
      {/* Branding */}
      <div className="flex items-center gap-3">
        <MjLogo
          size={44}
          gradientId="mjHeader"
          glowClass="drop-shadow-[0_0_10px_rgba(0,119,255,0.4)]"
        />
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white leading-tight">
            Mj Player
          </h1>
          <p className="text-[11px] text-theme-500 font-medium tracking-widest uppercase">
            Pro Edition
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {showInstallBtn && (
          <button
            type="button"
            onClick={onInstall}
            data-ocid="install.button"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-theme-600 to-theme-500 hover:from-theme-500 hover:to-theme-400 text-white text-sm font-bold border border-theme-400/50 shadow-[0_0_15px_var(--theme-glow)]"
          >
            <i className="fa-solid fa-download" /> <span>Install App</span>
          </button>
        )}

        <button
          type="button"
          onClick={onOpenSettings}
          data-tooltip="Settings"
          data-ocid="settings.open_modal_button"
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-white/10 text-sm font-medium transition-all hover:bg-white/10"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <i className="fa-solid fa-gear text-gray-400" />
          <span className="hidden sm:inline text-gray-200">Settings</span>
        </button>

        <button
          type="button"
          onClick={onLibraryToggle}
          data-tooltip="Media Library"
          data-ocid="library.toggle"
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-sm font-medium transition-all hover:bg-white/10"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <i className="fa-solid fa-folder-tree text-gray-400" />
          <span className="hidden sm:inline text-gray-200">Library</span>
        </button>

        {/* Recent dropdown */}
        <div className="relative" id="recentMenuContainer">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setRecentOpen((v) => !v);
            }}
            data-ocid="recent.dropdown_menu"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-sm font-medium transition-all hover:bg-white/10"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <i className="fa-solid fa-clock-rotate-left text-gray-400" />
            <span className="text-gray-200">Recent</span>
            <i className="fa-solid fa-chevron-down text-xs ml-1 text-gray-500" />
          </button>
          {recentOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-72 border border-gray-700/50 rounded-xl shadow-2xl z-50 overflow-hidden"
              style={{
                background: "rgba(26,28,35,0.97)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div className="p-3 border-b border-gray-700/50 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase">
                  Recent Media
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearRecent();
                  }}
                  data-ocid="recent.delete_button"
                  className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                >
                  Clear
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto flex flex-col py-1 custom-scrollbar">
                {recentFiles.length === 0 ? (
                  <div className="p-4 text-sm text-gray-500 text-center italic">
                    No recent files
                  </div>
                ) : (
                  recentFiles.map((f, i) => (
                    <button
                      type="button"
                      key={f.name}
                      data-ocid={`recent.item.${i + 1}`}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-3 border-b border-gray-700/30 last:border-0 transition-colors"
                      onClick={() => {
                        onFileSelect(f);
                        setRecentOpen(false);
                      }}
                    >
                      <i className="fa-solid fa-file-video text-gray-500" />
                      <span className="truncate">{f.name}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <label
          htmlFor="fileInputHeader"
          className="cursor-pointer flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-all text-sm font-bold shadow-lg"
          style={{ background: "#ffffff", color: "#000000" }}
        >
          <i className="fa-solid fa-images text-theme-600" />
          <span className="hidden sm:inline">Gallery / Files</span>
          <span className="sm:hidden">Open</span>
        </label>
        <input
          type="file"
          id="fileInputHeader"
          accept="video/*,audio/*"
          className="hidden"
          onChange={(e) =>
            e.target.files?.[0] && onFileSelect(e.target.files[0])
          }
        />
      </div>
    </header>
  );
}
