import { useEffect, useRef } from "react";

interface ActionIndicatorProps {
  icon: string;
  triggerAt: number; // increment to trigger ping
}

export function ActionIndicator({ icon, triggerAt }: ActionIndicatorProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prevTrigger = useRef(0);

  useEffect(() => {
    if (triggerAt !== prevTrigger.current && wrapperRef.current) {
      prevTrigger.current = triggerAt;
      const el = wrapperRef.current;
      el.classList.remove("mj-animate-ping");
      void el.offsetWidth;
      el.classList.add("mj-animate-ping");
    }
  }, [triggerAt]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
      <div
        ref={wrapperRef}
        className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl"
        style={{
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <i className={`fa-solid ${icon} ${icon === "fa-play" ? "ml-1" : ""}`} />
      </div>
    </div>
  );
}
