interface LibrarySidebarProps {
  isOpen: boolean;
  files: File[];
  currentFileName: string;
  onClose: () => void;
  onFileSelect: (file: File) => void;
  onFolderSelect: (files: FileList) => void;
}

export function LibrarySidebar({
  isOpen,
  files,
  currentFileName,
  onClose,
  onFileSelect,
  onFolderSelect,
}: LibrarySidebarProps) {
  return (
    <div
      className="fixed right-0 top-0 bottom-0 w-80 border-l border-gray-700/50 z-[100] flex flex-col shadow-2xl transition-transform duration-300"
      style={{
        background: "rgba(26,28,35,0.97)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
      }}
      data-ocid="library.panel"
    >
      <div
        className="p-4 border-b border-gray-700/50 flex justify-between items-center"
        style={{ background: "rgba(0,0,0,0.2)" }}
      >
        <h3 className="text-white font-bold tracking-tight">
          <i className="fa-solid fa-folder-open mr-2 text-theme-500" />
          Folder Library
        </h3>
        <button
          type="button"
          onClick={onClose}
          data-ocid="library.close_button"
          className="text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
        >
          <i className="fa-solid fa-xmark" />
        </button>
      </div>

      <div className="p-3 border-b border-gray-700/50">
        <label
          htmlFor="folderInputSidebar"
          className="w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-theme-500/30 text-theme-400 text-sm font-bold transition-all hover:bg-theme-500/20"
          style={{ background: "rgba(59,130,246,0.1)" }}
        >
          <i className="fa-solid fa-plus" /> Scan New Folder
        </label>
        <input
          type="file"
          id="folderInputSidebar"
          className="hidden"
          {...({
            webkitdirectory: "",
            directory: "",
            multiple: true,
          } as React.InputHTMLAttributes<HTMLInputElement>)}
          onChange={(e) => e.target.files && onFolderSelect(e.target.files)}
        />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1 pb-20">
        {files.length === 0 ? (
          <div className="text-center text-gray-500 text-sm mt-10 italic px-4">
            Select a folder to load all media files inside it.
          </div>
        ) : (
          files.map((f, i) => {
            const isActive = f.name === currentFileName;
            return (
              <button
                type="button"
                key={f.name}
                data-ocid={`library.item.${i + 1}`}
                className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center gap-3 rounded-lg group ${
                  isActive
                    ? "bg-theme-500/20 text-theme-400 border border-theme-500/30"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => onFileSelect(f)}
              >
                <i
                  className={`fa-solid fa-play text-xs w-3 ${isActive ? "opacity-100 text-theme-400" : "opacity-0 group-hover:opacity-100 text-gray-400"} transition-opacity`}
                />
                <span className="truncate flex-1">{f.name}</span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
