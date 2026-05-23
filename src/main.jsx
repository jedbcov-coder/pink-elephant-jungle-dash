window.__PEJD_BOOT__ = {
  ...(window.__PEJD_BOOT__ || {}),
  moduleStarted: true,
};

import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import "./styles.css";

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Pink Elephant failed to render", error, info);
  }

  render() {
    if (this.state.error) {
      const message = this.state.error?.message || "Unknown app error";
      return React.createElement(
        "main",
        { className: "app-fallback-screen" },
        React.createElement("section", { className: "app-fallback-card" },
          React.createElement("div", { className: "app-fallback-icon", "aria-hidden": "true" }, "🐘"),
          React.createElement("h1", null, "Pink Elephant could not start"),
          React.createElement("p", null, "The app hit a startup error instead of silently showing a blank jungle screen."),
          React.createElement("pre", null, message),
        ),
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Missing #root element; Pink Elephant cannot mount.");
}

createRoot(rootElement).render(
  React.createElement(React.StrictMode, null, React.createElement(AppErrorBoundary, null, React.createElement(App))),
);
if ("serviceWorker" in navigator) {
  let updateBannerElement = null;

  const removeUpdateBanner = () => {
    if (updateBannerElement) {
      updateBannerElement.remove();
      updateBannerElement = null;
    }
  };

  const showUpdateBanner = (onReload) => {
    if (updateBannerElement) {
      return;
    }

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
      const swUrl = `${import.meta.env.BASE_URL}service-worker.js?build=${__APP_VERSION__}`;
      const registration = await navigator.serviceWorker.register(swUrl, { updateViaCache: "none" });
      const registration = await navigator.serviceWorker.register(swUrl);

      const promptForUpdate = () => {
        showUpdateBanner(() => {
          if (registration.waiting) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
          }
        });
      };

      if (registration.waiting) {
        promptForUpdate();
      }

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
