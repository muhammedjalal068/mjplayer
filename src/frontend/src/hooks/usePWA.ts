import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [isIosSafari, setIsIosSafari] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const ios =
      /iPad|iPhone|iPod/.test(ua) &&
      !(window as unknown as { MSStream?: unknown }).MSStream;
    const safari =
      ios && /WebKit/.test(ua) && !/CriOS/.test(ua) && !/FxiOS/.test(ua);
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone ===
        true;

    setIsIosSafari(safari);

    if (!standalone && safari) {
      setShowInstallBtn(true);
    }

    // Inject manifest
    const manifestJSON = {
      name: "Mj Player Pro",
      short_name: "Mj Player",
      description: "Premium Local Media Player with 200% Audio Boost",
      start_url: "./",
      display: "standalone",
      background_color: "#0a0a0c",
      theme_color: "#3b82f6",
      icons: [
        {
          src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%230a0a0c"/><path d="M15 65 C15 40 25 25 40 25 C50 25 55 40 55 40 C55 40 60 25 75 25 C85 25 90 35 90 50 C90 75 75 90 60 90 C45 90 35 80 35 70" stroke="%233b82f6" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M55 40 L55 70 L80 55 Z" fill="white"/></svg>`,
          sizes: "512x512",
          type: "image/svg+xml",
          purpose: "any maskable",
        },
      ],
    };
    const manifestBlob = new Blob([JSON.stringify(manifestJSON)], {
      type: "application/json",
    });
    const manifestURL = URL.createObjectURL(manifestBlob);
    const link = document.createElement("link");
    link.rel = "manifest";
    link.href = manifestURL;
    document.head.appendChild(link);

    // Service worker
    const swCode = `self.addEventListener('install',(e)=>{self.skipWaiting();});self.addEventListener('activate',(e)=>{self.clients.claim();});self.addEventListener('fetch',(e)=>{});`;
    const swBlob = new Blob([swCode], { type: "application/javascript" });
    const swURL = URL.createObjectURL(swBlob);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register(swURL).catch(() => {});
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallBtn(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setShowInstallBtn(false));

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (isIosSafari) {
      setShowIosModal(true);
    } else if (deferredPrompt) {
      await deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === "accepted") setShowInstallBtn(false);
      setDeferredPrompt(null);
    }
  };

  return {
    showInstallBtn,
    isIosSafari,
    showIosModal,
    setShowIosModal,
    handleInstall,
  };
}
