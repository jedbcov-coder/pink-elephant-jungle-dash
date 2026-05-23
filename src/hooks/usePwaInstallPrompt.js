import { useCallback, useEffect, useMemo, useState } from "react";

const PWA_INSTALL_DISMISSED_KEY = "pwaInstallDismissed";

function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

export function setupServiceWorkerUpdatePrompt({ appVersion, baseUrl }) {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  let updateBannerElement = null;

  const removeUpdateBanner = () => {
    if (updateBannerElement) {
      updateBannerElement.remove();
      updateBannerElement = null;
    }
  };

  const showUpdateBanner = (onReload) => {
    if (updateBannerElement) return;

    const banner = document.createElement("div");
    banner.className = "sw-update-banner";
    banner.style.position = "fixed";
    banner.style.left = "50%";
    banner.style.bottom = "16px";
    banner.style.transform = "translateX(-50%)";
    banner.style.zIndex = "9999";
    banner.style.background = "rgba(17, 24, 39, 0.98)";
    banner.style.color = "#ffffff";
    banner.style.border = "1px solid rgba(255, 255, 255, 0.2)";
    banner.style.borderRadius = "10px";
    banner.style.padding = "12px 14px";
    banner.style.boxShadow = "0 12px 28px rgba(0, 0, 0, 0.4)";
    banner.style.display = "flex";
    banner.style.alignItems = "center";
    banner.style.gap = "10px";
    banner.style.maxWidth = "92vw";
    banner.style.fontFamily = "system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
    banner.innerHTML = '<span style="font-size:14px;line-height:1.3">Update available.</span>';

    const updateButton = document.createElement("button");
    updateButton.textContent = "Refresh";
    updateButton.type = "button";
    updateButton.style.background = "#ec4899";
    updateButton.style.color = "#ffffff";
    updateButton.style.border = "0";
    updateButton.style.borderRadius = "8px";
    updateButton.style.padding = "8px 12px";
    updateButton.style.cursor = "pointer";
    updateButton.addEventListener("click", () => {
      removeUpdateBanner();
      onReload();
    });

    const laterButton = document.createElement("button");
    laterButton.textContent = "Later";
    laterButton.type = "button";
    laterButton.style.background = "transparent";
    laterButton.style.color = "#ffffff";
    laterButton.style.border = "1px solid rgba(255,255,255,0.45)";
    laterButton.style.borderRadius = "8px";
    laterButton.style.padding = "8px 10px";
    laterButton.style.cursor = "pointer";
    laterButton.addEventListener("click", removeUpdateBanner);

    banner.append(updateButton, laterButton);
    document.body.appendChild(banner);
    updateBannerElement = banner;
  };

  window.addEventListener("load", async () => {
    try {
      const swUrl = `${baseUrl}service-worker.js?build=${appVersion}`;
      const registration = await navigator.serviceWorker.register(swUrl, { updateViaCache: "none" });

      const promptForUpdate = () => {
        showUpdateBanner(() => {
          if (registration.waiting) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
          }
        });
      };

      if (registration.waiting) promptForUpdate();

      registration.addEventListener("updatefound", () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;

        installingWorker.addEventListener("statechange", () => {
          if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
            promptForUpdate();
          }
        });
      });

      setInterval(() => {
        registration.update().catch(() => {
          // Ignore update check errors while offline.
        });
      }, 5 * 60 * 1000);

      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });
    } catch (error) {
      console.warn("Service worker registration failed", error);
    }
  });
}

export function usePwaInstallPrompt() {
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const standalone = isStandaloneMode();
    setInstalled(standalone);

    const wasDismissed = window.localStorage.getItem(PWA_INSTALL_DISMISSED_KEY) === "true";
    setDismissed(wasDismissed);

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      if (window.localStorage.getItem(PWA_INSTALL_DISMISSED_KEY) === "true") return;
      setDeferredInstallPrompt(event);
    };

    const handleAppInstalled = () => {
      setDeferredInstallPrompt(null);
      setInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const dismissInstallPrompt = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(PWA_INSTALL_DISMISSED_KEY, "true");
    }
    setDismissed(true);
    setDeferredInstallPrompt(null);
  }, []);

  const installGame = useCallback(async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const result = await deferredInstallPrompt.userChoice;
    setDeferredInstallPrompt(null);

    if (result?.outcome === "accepted") {
      setInstalled(true);
      return;
    }

    if (result?.outcome === "dismissed" && typeof window !== "undefined") {
      window.localStorage.setItem(PWA_INSTALL_DISMISSED_KEY, "true");
      setDismissed(true);
    }
  }, [deferredInstallPrompt]);

  const canShowInstallPrompt = useMemo(
    () => Boolean(deferredInstallPrompt) && !installed && !dismissed,
    [deferredInstallPrompt, dismissed, installed],
  );

  return {
    canShowInstallPrompt,
    dismissInstallPrompt,
    installGame,
  };
}
