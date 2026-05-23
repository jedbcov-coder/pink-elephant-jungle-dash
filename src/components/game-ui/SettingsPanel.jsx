import React, { useEffect } from "react";

import { PwaInstallCard } from "./PwaInstallCard.jsx";
import { SaveDebugTools } from "./SaveDebugTools.jsx";

export function SettingsPanel({
  open,
  context,
  onClose,
  audioState,
  onToggleAudio,
  graphicsQuality,
  onGraphicsQualityChange,
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
    <section className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center px-6" style={{ background: "rgba(7,12,8,0.6)", backdropFilter: "blur(3px)" }} aria-modal="true" role="dialog" aria-labelledby="settings-title">
      <div className="w-full max-w-3xl rounded-[1.5rem] p-6 text-left text-amber-50" style={{ background: "rgba(12,20,10,0.95)", border: "1px solid rgba(246,210,138,0.28)", boxShadow: "0 0 45px rgba(0,0,0,0.32)", maxHeight: "92vh", overflowY: "auto" }}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.32em] text-emerald-200/70">Settings</div>
            <h2 id="settings-title" className="display-title mt-1 text-3xl font-black text-pink-200">Game Settings</h2>
            <p className="mt-1 text-xs text-amber-50/65">Opened from {context === "pause" ? "Pause" : "Title"}. Press Esc to close.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-amber-50 transition hover:scale-105 active:scale-95">Close</button>
        </div>

        <div className="mt-5 border-t border-amber-100/20 pt-4">
          <h3 className="text-sm font-black uppercase tracking-[0.18em] text-amber-100">Audio</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => onToggleAudio("muted")} className="rounded-full px-4 py-2 text-xs font-black" style={{ background: audioState.muted ? "rgba(248,113,113,0.92)" : "rgba(134,239,172,0.92)", color: "#082f1a" }}>{audioState.muted ? "Master: Off" : "Master: On"}</button>
            <button type="button" onClick={() => onToggleAudio("musicMuted")} className="rounded-full px-4 py-2 text-xs font-black" style={{ background: audioState.muted || audioState.musicMuted ? "rgba(255,255,255,0.14)" : "rgba(251,191,36,0.9)", color: audioState.muted || audioState.musicMuted ? "rgba(255,255,255,0.75)" : "#422006" }}>Music {audioState.muted || audioState.musicMuted ? "Off" : "On"}</button>
            <button type="button" onClick={() => onToggleAudio("sfxMuted")} className="rounded-full px-4 py-2 text-xs font-black" style={{ background: audioState.muted || audioState.sfxMuted ? "rgba(255,255,255,0.14)" : "rgba(244,114,182,0.9)", color: audioState.muted || audioState.sfxMuted ? "rgba(255,255,255,0.75)" : "#4a044e" }}>SFX {audioState.muted || audioState.sfxMuted ? "Off" : "On"}</button>
          </div>
        </div>

        <div className="mt-5 border-t border-amber-100/20 pt-4">
          <h3 className="text-sm font-black uppercase tracking-[0.18em] text-amber-100">Controls</h3>
          <p className="mt-2 text-xs text-amber-50/75"><strong>Desktop:</strong> Arrow keys or WASD move, Space jumps (hold to slide), and F smashes.</p>
          <p className="mt-1 text-xs text-amber-50/75"><strong>Mobile:</strong> Touch buttons appear on touch devices.</p>
          <p className="mt-1 text-xs text-emerald-100/50">Tip: Landscape mode is recommended on mobile.</p>
        </div>

        <div className="mt-5 border-t border-amber-100/20 pt-4">
          <h3 className="text-sm font-black uppercase tracking-[0.18em] text-amber-100">Display</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {[
              ["high", "High"],
              ["balanced", "Balanced"],
              ["battery-saver", "Battery Saver"],
            ].map(([value, label]) => (
              <button key={value} type="button" onClick={() => onGraphicsQualityChange(value)} aria-pressed={graphicsQuality === value} className="rounded-full px-4 py-2 text-xs font-black" style={{ background: graphicsQuality === value ? "rgba(167,243,208,0.95)" : "rgba(255,255,255,0.12)", color: graphicsQuality === value ? "#022c22" : "rgba(255,255,255,0.85)" }}>{label}</button>
            ))}
          </div>
        </div>

        <div className="mt-5 border-t border-amber-100/20 pt-4">
          <h3 className="text-sm font-black uppercase tracking-[0.18em] text-amber-100">PWA App</h3>
          <p className="mt-2 text-xs text-amber-50/75">Current mode: {modeLabel}.</p>
          <PwaInstallCard visible={showInstallCard} canInstall={canInstall && !isStandalone} onInstall={onInstall} onDismiss={onDismissInstall} />
        </div>

        <div className="mt-5 border-t border-amber-100/20 pt-4">
          <h3 className="text-sm font-black uppercase tracking-[0.18em] text-amber-100">Save Data</h3>
          <SaveDebugTools visible={showSaveTools} onToggle={onToggleSaveTools} onExport={onExportSave} onImport={onImportSave} onReset={onResetSave} />
        </div>

        <div className="mt-5 border-t border-amber-100/20 pt-4 text-xs text-amber-50/75">
          <h3 className="text-sm font-black uppercase tracking-[0.18em] text-amber-100">About</h3>
          <p className="mt-2">Pink Elephant Jungle Dash</p>
          <p className="mt-1">Version: {appVersion}</p>
        </div>
      </div>
    </section>
  );
}
