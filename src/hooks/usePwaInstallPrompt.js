import { useCallback, useEffect, useMemo, useState } from "react";

const PWA_INSTALL_DISMISSED_KEY = "pwaInstallDismissed";

function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
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
