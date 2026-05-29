import React, { useEffect } from "react";

import { AchievementsPanel } from "./AchievementsPanel.jsx";
import { PwaInstallCard } from "./PwaInstallCard.jsx";
import { SaveDebugTools } from "./SaveDebugTools.jsx";

const sectionCardClass = "rounded-2xl border border-amber-100/20 bg-black/20 p-4";
const segmentedButtonClass = "jungle-focus-ring rounded-xl border border-emerald-100/30 bg-emerald-950/45 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-emerald-100 transition hover:bg-emerald-900/55";

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
  gamepadStatus,
  hapticsEnabled,
  hapticsSupported,
  onHapticsChange,
  accessibilitySettings,
  onAccessibilityChange,
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
  achievementRecords,
  onOpenCredits,
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
  const gamepadLabel = gamepadStatus?.gamepadConnected ? gamepadStatus.gamepadName : "No gamepad connected";
  const accessibilityRows = [
    ["reduceMotionEnabled", "Reduce Motion", "Calms transitions and decorative motion."],
    ["softFlashesEnabled", "Soft Flashes", "Uses gentler end-screen and warning effects."],
    ["highContrastEnabled", "High Contrast", "Strengthens menu and HUD contrast."],
    ["largeTextEnabled", "Larger Text", "Makes menu text easier to read."],
  ];

  return (
    <section className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center px-4 sm:px-6" style={{ background: "rgba(7,12,8,0.6)", backdropFilter: "blur(3px)" }} aria-modal="true" role="dialog" aria-labelledby="settings-title">
      <div className="jungle-menu-card w-full max-w-5xl text-left sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.32em] text-emerald-200/70">Settings</div>
            <h2 id="settings-title" className="display-title mt-1 text-2xl font-black text-pink-200 sm:text-3xl">Game Settings</h2>
            <p className="mt-1 text-xs text-amber-50/65">From {context === "pause" ? "Pause" : "Title"}. Esc closes this panel.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close settings" className="jungle-focus-ring jungle-menu-button-secondary w-auto px-4 py-2 text-xs uppercase tracking-wider">Close</button>
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
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl border border-amber-100/20 bg-black/20 p-3 text-xs text-amber-50/85">
                <p className="text-sm font-black uppercase tracking-[0.14em] text-emerald-100">Gamepad</p>
                <p className="mt-1">{gamepadStatus?.gamepadSupported ? gamepadLabel : "Gamepad API unavailable"}</p>
                <p className="mt-1 text-amber-50/60">Left stick / D-pad move, A jumps, B/X/L/R smashes, Start pauses.</p>
              </div>
              <div className="rounded-xl border border-amber-100/20 bg-black/20 p-3 text-xs text-amber-50/85">
                <div className="flex items-center justify-between gap-2">
                  <span>
                    <span className="block text-sm font-black uppercase tracking-[0.14em] text-emerald-100">Haptics</span>
                    <span className="mt-1 block text-amber-50/65">{hapticsSupported ? "Phone vibration feedback" : "Not supported here"}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onHapticsChange(!hapticsEnabled)}
                    aria-pressed={Boolean(hapticsEnabled)}
                    disabled={!hapticsSupported}
                    className={`${segmentedButtonClass} min-w-[74px] ${hapticsEnabled ? "border-emerald-200/70 bg-emerald-200/90 text-emerald-950" : ""}`}
                  >
                    {hapticsEnabled ? "ON" : "OFF"}
                  </button>
                </div>
              </div>
            </div>
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

          <div id="settings-accessibility" className={sectionCardClass}>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-amber-100">Accessibility</h3>
            <div className="mt-3 space-y-2">
              {accessibilityRows.map(([key, label, description]) => {
                const enabled = Boolean(accessibilitySettings?.[key]);
                return (
                  <div key={key} className="settings-toggle-row">
                    <span>
                      <span className="settings-toggle-label">{label}</span>
                      <span className="settings-toggle-description">{description}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => onAccessibilityChange(key, !enabled)}
                      aria-pressed={enabled}
                      className={`${segmentedButtonClass} min-w-[74px] ${enabled ? "border-emerald-200/70 bg-emerald-200/90 text-emerald-950" : ""}`}
                    >
                      {enabled ? "ON" : "OFF"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div id="settings-gameplay" className={sectionCardClass}>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-amber-100">Gameplay</h3>
            <dl className="mt-3 grid gap-2 text-xs text-amber-50/75">
              <div className="rounded-xl border border-amber-100/15 bg-black/20 px-3 py-2">
                <dt className="font-black uppercase tracking-[0.12em] text-emerald-100">Auto Pause</dt>
                <dd className="mt-1">The run pauses on blur, tab hide, and app background.</dd>
              </div>
              <div className="rounded-xl border border-amber-100/15 bg-black/20 px-3 py-2">
                <dt className="font-black uppercase tracking-[0.12em] text-emerald-100">Input Safety</dt>
                <dd className="mt-1">Pause, complete, game over, and settings clear held keyboard/touch input.</dd>
              </div>
            </dl>
          </div>

          <div id="settings-save" className={sectionCardClass}>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-amber-100">Save Data</h3>
            <SaveDebugTools visible={showSaveTools} onToggle={onToggleSaveTools} onExport={onExportSave} onImport={onImportSave} onReset={onResetSave} />
            <div className="mt-3 border-t border-amber-100/20 pt-3 text-xs text-amber-50/70">
              <p>{modeLabel}</p>
              <PwaInstallCard visible={showInstallCard} canInstall={canInstall && !isStandalone} onInstall={onInstall} onDismiss={onDismissInstall} />
            </div>
          </div>

          <div id="settings-achievements" className={sectionCardClass}>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-amber-100">Achievements</h3>
            <AchievementsPanel records={achievementRecords} />
          </div>

          <div id="settings-credits" className={sectionCardClass}>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-amber-100">Credits & Template</h3>
            <dl className="mt-3 grid gap-2 text-xs text-amber-50/75">
              <div className="rounded-xl border border-amber-100/15 bg-black/20 px-3 py-2">
                <dt className="font-black uppercase tracking-[0.12em] text-emerald-100">Game</dt>
                <dd className="mt-1">Pink Elephant Jungle Dash</dd>
              </div>
              <div className="rounded-xl border border-amber-100/15 bg-black/20 px-3 py-2">
                <dt className="font-black uppercase tracking-[0.12em] text-emerald-100">Template Defaults</dt>
                <dd className="mt-1">PWA install, offline cache, save tools, audio, touch controls, and release markers.</dd>
              </div>
              <div className="rounded-xl border border-amber-100/15 bg-black/20 px-3 py-2">
                <dt className="font-black uppercase tracking-[0.12em] text-emerald-100">Attribution Slot</dt>
                <dd className="mt-1">Replace this with project art, music, SFX, engine, and license credits.</dd>
              </div>
            </dl>
            <button type="button" onClick={onOpenCredits} className="jungle-focus-ring jungle-menu-button-secondary mt-3 w-full text-sm">
              Open Credits
            </button>
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
