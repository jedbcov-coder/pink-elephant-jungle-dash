window.__PEJD_BOOT__ = {
  ...(window.__PEJD_BOOT__ || {}),
  moduleStarted: true,
};

import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import { APP_BUILD_LABEL, APP_UPDATE_NOTE, APP_VERSION } from "./appInfo.js";
import { setupServiceWorkerUpdatePrompt } from "./pwa/setupServiceWorkerUpdatePrompt.js";
import "./styles.css";
import "./styles/game-ui.css";

if (!window.__PEJD_BOOT__.versionLogged) {
  console.info(`Pink Elephant version: ${APP_VERSION} | ${APP_BUILD_LABEL} | ${APP_UPDATE_NOTE}`);
  window.__PEJD_BOOT__.versionLogged = true;
}

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

setupServiceWorkerUpdatePrompt({
  appVersion: __APP_VERSION__,
  baseUrl: import.meta.env.BASE_URL,
});
