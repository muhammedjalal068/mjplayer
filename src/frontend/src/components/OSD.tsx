interface OSDProps {
  text: string;
  icon: string;
  visible: boolean;
}

export function OSD({ text, icon, visible }: OSDProps) {
  return (
    <div
      className="absolute top-8 right-8 z-30 pointer-events-none flex items-center gap-3 px-5 py-3 rounded-lg font-medium text-sm tracking-wide border border-white/10 shadow-2xl transition-opacity duration-300"
      style={{
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        opacity: visible ? 1 : 0,
      }}
    >
      <i className={`fa-solid ${icon} text-theme-500`} />
      <span className="text-white">{text}</span>
    </div>
  );
}
