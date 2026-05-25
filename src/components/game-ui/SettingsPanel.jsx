import React, { useEffect } from "react";

import { PwaInstallCard } from "./PwaInstallCard.jsx";
import { SaveDebugTools } from "./SaveDebugTools.jsx";

const sectionCardClass = "rounded-2xl border border-amber-100/20 bg-black/20 p-4";
const segmentedButtonClass = "rounded-xl border border-emerald-100/30 bg-emerald-950/45 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-emerald-100 transition hover:bg-emerald-900/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200/80 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-950";

export function SettingsPanel({
  open,
  context,
  onClose,
  audioState,
  onToggleAudio,
  graphicsQuality,
  onGraphicsQualityChange,
  touchControlsMode,
  onTouchControlsModeChange,
  isStandalone,
  canInstall,
  showInstallCard,
  onInstall,
  onDismissInstall,
  showSaveTools,
  onToggleSaveTools,
  onExportSave,
  onImportSave,
  onResetSave,
  appVersion,
}) {
  useEffect(() => {
    if (!open) return;
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

  const modeLabel = isStandalone ? "Installed app mode" : "Browser tab mode";

  return (
    <section className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center px-4 sm:px-6" style={{ background: "rgba(7,12,8,0.6)", backdropFilter: "blur(3px)" }} aria-modal="true" role="dialog" aria-labelledby="settings-title">
      <div className="w-full max-w-5xl rounded-[1.5rem] p-4 text-left text-amber-50 sm:p-5" style={{ background: "rgba(12,20,10,0.95)", border: "1px solid rgba(246,210,138,0.28)", boxShadow: "0 0 45px rgba(0,0,0,0.32)" }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.32em] text-emerald-200/70">Settings</div>
            <h2 id="settings-title" className="display-title mt-1 text-2xl font-black text-pink-200 sm:text-3xl">Game Settings</h2>
            <p className="mt-1 text-xs text-amber-50/65">From {context === "pause" ? "Pause" : "Title"}. Esc closes this panel.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close settings" className="hud-settings-button rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider transition hover:scale-105 active:scale-95">Close</button>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <div id="settings-audio" className={sectionCardClass}>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-amber-100">Audio</h3>
            <div className="mt-3 space-y-2">
              {[
                ["Master Audio", !(audioState.muted), "muted"],
                ["Music", !(audioState.muted || audioState.musicMuted), "musicMuted"],
                ["SFX", !(audioState.muted || audioState.sfxMuted), "sfxMuted"],
              ].map(([label, enabled, key]) => (
                <div key={key} className="flex items-center justify-between gap-3 rounded-xl border border-emerald-100/20 bg-emerald-950/25 px-3 py-2">
                  <span className="text-sm font-semibold text-amber-50">{label}</span>
                  <button
                    type="button"
                    onClick={() => onToggleAudio(key)}
                    aria-pressed={Boolean(enabled)}
                    className={`${segmentedButtonClass} min-w-[74px] ${enabled ? "border-emerald-200/70 bg-emerald-200/90 text-emerald-950" : ""}`}
                  >
                    {enabled ? "ON" : "OFF"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div id="settings-controls" className={sectionCardClass}>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-amber-100">Controls</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-amber-100/20 bg-black/20 p-3 text-xs text-amber-50/85">
                <p className="text-sm font-black uppercase tracking-[0.14em] text-emerald-100">Desktop</p>
                <p className="mt-1">Move: WASD / Arrows</p>
                <p>Jump / Slide: Space</p>
                <p>Smash: F</p>
              </div>
              <div className="rounded-xl border border-amber-100/20 bg-black/20 p-3 text-xs text-amber-50/85">
                <p className="text-sm font-black uppercase tracking-[0.14em] text-emerald-100">Mobile</p>
                <p className="mt-1">Drag: Steer</p>
                <p>Buttons: Jump / Smash</p>
              </div>
            </div>
            <fieldset className="mt-3">
              <legend className="text-xs font-black uppercase tracking-[0.14em] text-amber-100">Touch Controls</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {[
                  ["auto", "Automatic"],
                  ["always", "Always Visible"],
                  ["off", "Disabled"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => onTouchControlsModeChange(value)}
                    aria-pressed={touchControlsMode === value}
                    className={`${segmentedButtonClass} w-full text-center ${touchControlsMode === value ? "border-emerald-200/70 bg-emerald-200/90 text-emerald-950" : ""}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <div id="settings-display" className={sectionCardClass}>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-amber-100">Graphics</h3>
            <p className="mt-2 text-xs text-amber-50/75">Graphics Quality</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[
                ["high", "High", ""],
                ["balanced", "Balanced", "Recommended"],
                ["battery-saver", "Saver", ""],
              ].map(([value, label, sub]) => (
                <button key={value} type="button" onClick={() => onGraphicsQualityChange(value)} aria-pressed={graphicsQuality === value} className={`${segmentedButtonClass} min-h-[56px] px-2 py-2 normal-case tracking-normal ${graphicsQuality === value ? "border-emerald-200/70 bg-emerald-200/90 text-emerald-950" : ""}`}>
                  <span className="block text-sm font-bold">{label}</span>
                  {sub ? <span className="block text-[10px] opacity-85">({sub})</span> : null}
                </button>
              ))}
            </div>
          </div>

          <div id="settings-save" className={sectionCardClass}>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-amber-100">Save Data</h3>
            <SaveDebugTools visible={showSaveTools} onToggle={onToggleSaveTools} onExport={onExportSave} onImport={onImportSave} onReset={onResetSave} />
            <div className="mt-3 border-t border-amber-100/20 pt-3 text-xs text-amber-50/70">
              <p>{modeLabel}</p>
              <PwaInstallCard visible={showInstallCard} canInstall={canInstall && !isStandalone} onInstall={onInstall} onDismiss={onDismissInstall} />
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-amber-100/20 pt-2 text-center text-[11px] text-amber-50/50">
<p>Pink Elephant Jungle Dash</p>
<p className="mt-1 text-amber-50/65">
  Made with love for Georgia, by Uncle Jed
</p>
<p className="mt-1">Version {appVersion}</p>
        </div>
      </div>
    </section>
  );
}
