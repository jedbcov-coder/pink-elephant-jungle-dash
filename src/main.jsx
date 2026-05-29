window.__PEJD_BOOT__ = {
  ...(window.__PEJD_BOOT__ || {}),
  moduleStarted: true,
};

import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";

const App = React.lazy(() => import("./App.jsx"));
import { APP_BUILD_LABEL, APP_UPDATE_NOTE, APP_VERSION } from "./appInfo.js";
import { setupServiceWorkerUpdatePrompt } from "./pwa/setupServiceWorkerUpdatePrompt.js";
import "./styles.css";
import "./styles/game-ui.css";

const APP_BASE_URL = import.meta.env.BASE_URL || "./";

if (!window.__PEJD_BOOT__.versionLogged) {
  console.info(`Pink Elephant version: ${APP_VERSION} | ${APP_BUILD_LABEL} | ${APP_UPDATE_NOTE}`);
  window.__PEJD_BOOT__.versionLogged = true;
}

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, copiedDebugInfo: false, copyDebugInfoFailed: false };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Pink Elephant failed to render", error, info);
  }

  buildDebugInfo() {
    const error = this.state.error;
    return JSON.stringify({
      appVersion: APP_VERSION,
      appBuildLabel: APP_BUILD_LABEL,
      appUpdateNote: APP_UPDATE_NOTE,
      message: error?.message || "Unknown app error",
      stack: error?.stack || null,
      location: window.location.href,
      userAgent: navigator.userAgent,
      boot: window.__PEJD_BOOT__ || {},
    }, null, 2);
  }

  handleRestartGame = () => {
    window.location.reload();
  };

  handleReturnToMenu = () => {
    window.location.assign(APP_BASE_URL);
  };

  handleCopyDebugInfo = async () => {
    try {
      await navigator.clipboard.writeText(this.buildDebugInfo());
      this.setState({ copiedDebugInfo: true, copyDebugInfoFailed: false });
    } catch {
      this.setState({ copiedDebugInfo: false, copyDebugInfoFailed: true });
    }
  };

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
          React.createElement("div", { className: "app-fallback-actions" },
            React.createElement("button", { type: "button", className: "jungle-focus-ring jungle-menu-button-primary", onClick: this.handleRestartGame }, "Restart Game"),
            React.createElement("button", { type: "button", className: "jungle-focus-ring jungle-menu-button-secondary", onClick: this.handleReturnToMenu }, "Return to Menu"),
            React.createElement("button", { type: "button", className: "jungle-focus-ring jungle-menu-button-secondary", onClick: this.handleCopyDebugInfo }, "Copy Debug Info"),
          ),
          this.state.copiedDebugInfo
            ? React.createElement("p", { className: "app-fallback-status" }, "Debug info copied.")
            : null,
          this.state.copyDebugInfoFailed
            ? React.createElement("p", { className: "app-fallback-status" }, "Copy did not work in this browser. The short error message above is still visible.")
            : null,
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
  React.createElement(
    React.StrictMode,
    null,
    React.createElement(
      AppErrorBoundary,
      null,
      React.createElement(
        Suspense,
        { fallback: React.createElement("main", { className: "app-fallback-screen" }, React.createElement("section", { className: "app-fallback-card" }, React.createElement("p", null, "Loading Pink Elephant Jungle Dash…"))) },
        React.createElement(App),
      ),
    ),
  ),
);

setupServiceWorkerUpdatePrompt({
  appVersion: APP_VERSION,
  baseUrl: import.meta.env.BASE_URL,
});
