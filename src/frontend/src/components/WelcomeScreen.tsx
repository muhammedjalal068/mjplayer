import { useCallback, useRef } from "react";
import { MjLogo } from "./MjLogo";

interface WelcomeScreenProps {
  onFileSelect: (file: File) => void;
  onFolderSelect: (files: FileList) => void;
  showInstallBtn: boolean;
  onInstall: () => void;
  username?: string;
}

export function WelcomeScreen({
  onFileSelect,
  onFolderSelect,
  showInstallBtn,
  onInstall,
  username,
}: WelcomeScreenProps) {
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const preventDefaults = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDragEnter = (e: React.DragEvent) => {
    preventDefaults(e);
    dropZoneRef.current?.classList.add("mj-drag-active");
  };
  const onDragLeave = (e: React.DragEvent) => {
    preventDefaults(e);
    dropZoneRef.current?.classList.remove("mj-drag-active");
  };
  const onDrop = (e: React.DragEvent) => {
    preventDefaults(e);
    dropZoneRef.current?.classList.remove("mj-drag-active");
    if (e.dataTransfer.files.length > 0) onFileSelect(e.dataTransfer.files[0]);
  };

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6"
      style={{
        background:
          "linear-gradient(to bottom, rgba(17,24,39,0.5), rgba(0,0,0,0.8))",
      }}
    >
      {username && (
        <div className="mb-6 text-center transform transition-all duration-500">
          <h2 className="text-2xl font-medium text-theme-400">Welcome back,</h2>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            {username}
          </h1>
        </div>
      )}

      <div
        ref={dropZoneRef}
        className="w-full max-w-3xl border-2 border-dashed border-white/20 rounded-3xl p-8 sm:p-16 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-theme-500/50 hover:bg-theme-500/5 shadow-2xl"
        style={{
          background: "rgba(17,24,39,0.4)",
          backdropFilter: "blur(4px)",
        }}
        onDragEnter={onDragEnter}
        onDragOver={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="mb-8">
          <MjLogo
            size={112}
            gradientId="mjWelcome"
            glowClass="drop-shadow-[0_0_15px_rgba(0,119,255,0.5)]"
          />
        </div>
        <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
          Drop your media here
        </h2>
        <p className="text-gray-400 mb-10 max-w-md text-lg leading-relaxed">
          Experience pristine playback with 200% audio boost and premium
          controls. Completely private &amp; local.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl justify-center">
          <label
            htmlFor="fileInputMain"
            className="flex-1 cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-4 font-semibold text-white transition-all duration-300 bg-theme-600 rounded-xl hover:bg-theme-500 hover:scale-105 shadow-[0_0_20px_var(--theme-glow)] border border-theme-500/50"
          >
            <i className="fa-solid fa-file-video text-lg" />
            <span>Single File</span>
          </label>
          <label
            htmlFor="folderInputMain"
            className="flex-1 cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-4 font-semibold text-white transition-all duration-300 rounded-xl hover:scale-105 border border-gray-500/50 hover:bg-white/10"
            style={{ background: "rgba(55,65,81,0.8)" }}
          >
            <i className="fa-solid fa-folder-tree text-lg" />
            <span>Open Folder</span>
          </label>
          <label
            htmlFor="fileInputGallery"
            className="flex-1 cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-4 font-semibold text-white transition-all duration-300 rounded-xl hover:scale-105 shadow-[0_0_20px_rgba(0,0,0,0.2)] border border-gray-600"
            style={{ background: "rgba(31,41,55,0.8)" }}
          >
            <i className="fa-solid fa-images text-lg text-theme-400" />
            <span>Gallery</span>
          </label>
        </div>

        {showInstallBtn && (
          <button
            type="button"
            onClick={onInstall}
            className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 bg-gradient-to-r from-theme-600 to-theme-500 rounded-xl hover:from-theme-500 hover:to-theme-400 hover:scale-105 shadow-[0_0_20px_var(--theme-glow)] border border-theme-400/50"
          >
            <i className="fa-solid fa-mobile-screen-button text-lg" />
            <span>Install Mj Player App</span>
          </button>
        )}

        <input
          type="file"
          id="fileInputMain"
          accept="video/*,audio/*"
          className="hidden"
          onChange={(e) =>
            e.target.files?.[0] && onFileSelect(e.target.files[0])
          }
        />
        <input
          type="file"
          id="fileInputGallery"
          accept="video/*,image/*"
          className="hidden"
          onChange={(e) =>
            e.target.files?.[0] && onFileSelect(e.target.files[0])
          }
        />
        <input
          type="file"
          id="folderInputMain"
          className="hidden"
          {...({
            webkitdirectory: "",
            directory: "",
            multiple: true,
          } as React.InputHTMLAttributes<HTMLInputElement>)}
          onChange={(e) => e.target.files && onFolderSelect(e.target.files)}
        />
      </div>

      <div className="mt-14 flex flex-wrap justify-center gap-8 text-sm text-gray-500 font-medium">
        <span
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10"
          style={{ background: "rgba(31,41,55,0.3)" }}
        >
          <i className="fa-solid fa-bolt text-theme-500" /> 200% Audio Boost
        </span>
        <span
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10"
          style={{ background: "rgba(31,41,55,0.3)" }}
        >
          <i className="fa-solid fa-keyboard text-theme-400" /> Pro Shortcuts
        </span>
        <span
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10"
          style={{ background: "rgba(31,41,55,0.3)" }}
        >
          <i className="fa-solid fa-shield-halved text-green-400/70" /> 100%
          Local
        </span>
      </div>
    </div>
  );
}
