interface IosInstallModalProps {
  visible: boolean;
  onClose: () => void;
}

export function IosInstallModal({ visible, onClose }: IosInstallModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-end pb-8 px-4 transition-opacity duration-300"
      style={{
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(4px)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      aria-hidden={!visible}
      data-ocid="ios_install.dialog"
    >
      <div
        className="border border-gray-700/80 p-6 rounded-3xl w-full max-w-sm relative flex flex-col items-center text-center shadow-2xl transition-transform duration-300"
        style={{
          background: "rgba(26,28,35,0.98)",
          transform: visible ? "translateY(0)" : "translateY(40px)",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          data-ocid="ios_install.close_button"
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <i className="fa-solid fa-xmark" />
        </button>

        <div
          className="w-16 h-16 mb-4 flex items-center justify-center rounded-2xl border border-theme-500/30 shadow-[0_0_15px_var(--theme-glow)]"
          style={{ background: "#000" }}
        >
          <svg
            viewBox="0 0 100 100"
            fill="none"
            width={40}
            height={40}
            role="img"
            aria-label="Mj Player logo"
          >
            <path
              d="M 15 65 C 15 40, 25 25, 40 25 C 50 25, 55 40, 55 40 C 55 40, 60 25, 75 25 C 85 25, 90 35, 90 50"
              stroke="var(--theme-500)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 90 50 C 90 75, 75 90, 60 90 C 45 90, 35 80, 35 70"
              stroke="var(--theme-500)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M 55 40 L 55 70 L 80 55 Z" fill="white" />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
          Install Mj Player
        </h3>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          Install this web application on your iPhone or iPad for fullscreen
          access and an offline native feel.
        </p>

        <div
          className="rounded-xl p-5 text-left w-full text-sm text-gray-200 border border-white/5"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <p className="mb-4 flex items-start gap-3">
            <span
              className="text-theme-400 w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mt-0.5 border border-theme-500/30"
              style={{ background: "rgba(59,130,246,0.2)" }}
            >
              1
            </span>
            <span>
              Tap the{" "}
              <i className="fa-solid fa-arrow-up-from-bracket mx-1 text-theme-400" />{" "}
              <b>Share</b> button at the bottom of Safari.
            </span>
          </p>
          <p className="flex items-start gap-3">
            <span
              className="text-theme-400 w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mt-0.5 border border-theme-500/30"
              style={{ background: "rgba(59,130,246,0.2)" }}
            >
              2
            </span>
            <span>
              Scroll down and tap <br />
              <b>Add to Home Screen</b>{" "}
              <i className="fa-solid fa-square-plus ml-1 text-gray-400" />
            </span>
          </p>
        </div>

        <div className="mt-8 text-2xl text-theme-500 animate-bounce">
          <i className="fa-solid fa-arrow-down" />
        </div>
      </div>
    </div>
  );
}
