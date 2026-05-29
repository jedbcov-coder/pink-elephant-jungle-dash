import React, { useEffect } from "react";

export function CreditsOverlay({ open, appVersion, appBuildLabel, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <section className="game-modal-overlay pointer-events-auto absolute inset-0 z-40 flex items-center justify-center px-4 sm:px-6" aria-modal="true" role="dialog" aria-labelledby="credits-title">
      <div className="game-modal-card credits-modal">
        <div className="game-modal-header">
          <div>
            <div className="game-modal-kicker">Credits & About</div>
            <h2 id="credits-title" className="display-title game-modal-title">Pink Elephant Jungle Dash</h2>
            <p className="game-modal-copy">A reusable credits screen for game, template, music, SFX, art, engine, and license notes.</p>
          </div>
          <button type="button" onClick={onClose} className="jungle-focus-ring jungle-menu-button-secondary game-modal-close">Close</button>
        </div>

        <div className="credits-grid">
          <article>
            <h3>Game</h3>
            <p>Made with love for Georgia, by Uncle Jed.</p>
          </article>
          <article>
            <h3>Template Defaults</h3>
            <p>Start, settings, pause, level complete, game over, level select, credits, save tools, PWA install, offline cache, and update prompts.</p>
          </article>
          <article>
            <h3>Audio</h3>
            <p>Generated title music and gameplay sound effects are wired through the local AudioManager.</p>
          </article>
          <article>
            <h3>Engine</h3>
            <p>React, Vite, Three.js, browser storage, and a service worker form the current web game shell.</p>
          </article>
          <article>
            <h3>Attribution Slots</h3>
            <p>Replace this section with final art, music, SFX, font, model, and license credits before shipping a new game.</p>
          </article>
          <article>
            <h3>Build</h3>
            <p>Version {appVersion}</p>
            <p>{appBuildLabel}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
