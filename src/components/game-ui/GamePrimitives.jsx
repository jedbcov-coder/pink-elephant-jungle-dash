import React from "react";

export function GameButton({ children, variant = "secondary", className = "", ...props }) {
  const variantClass = variant === "primary"
    ? "jungle-menu-button-primary"
    : variant === "warning"
      ? "jungle-menu-button-warning"
      : "jungle-menu-button-secondary";

  return (
    <button type="button" className={`jungle-focus-ring ${variantClass} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

export function IconButton({ label, icon, className = "", ...props }) {
  return (
    <button type="button" aria-label={label} title={label} className={`jungle-focus-ring hud-settings-button hud-settings-icon-button ${className}`.trim()} {...props}>
      {icon}
    </button>
  );
}

export function GameModal({ title, kicker, children, onClose }) {
  return (
    <section className="game-modal-overlay pointer-events-auto absolute inset-0 z-40 flex items-center justify-center px-4 sm:px-6" aria-modal="true" role="dialog" aria-labelledby="game-modal-title">
      <div className="game-modal-card">
        <div className="game-modal-header">
          <div>
            {kicker ? <div className="game-modal-kicker">{kicker}</div> : null}
            <h2 id="game-modal-title" className="display-title game-modal-title">{title}</h2>
          </div>
          {onClose ? <GameButton onClick={onClose} className="game-modal-close">Close</GameButton> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

export function Slider({ label, value, min = 0, max = 1, step = 0.01, onChange, formatValue = (nextValue) => `${Math.round(nextValue * 100)}%` }) {
  const numericValue = Number(value);

  return (
    <label className="settings-toggle-row">
      <span>
        <span className="settings-toggle-label">{label}</span>
        <span className="settings-toggle-description">{formatValue(numericValue)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={numericValue}
        onChange={(event) => onChange(Number(event.target.value))}
        className="game-slider"
      />
    </label>
  );
}

export function ToggleButton({ label, enabled, onToggle }) {
  return (
    <button type="button" aria-pressed={Boolean(enabled)} onClick={() => onToggle(!enabled)} className={`jungle-focus-ring game-toggle-button ${enabled ? "game-toggle-button-on" : "game-toggle-button-off"}`}>
      {label}: {enabled ? "ON" : "OFF"}
    </button>
  );
}

export function Tabs({ tabs, activeId, onChange, label = "Game tabs" }) {
  return (
    <div className="game-tabs" role="tablist" aria-label={label}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={tab.id === activeId}
          className={`jungle-focus-ring game-tab ${tab.id === activeId ? "game-tab-active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function Tooltip({ label, children }) {
  return (
    <span className="game-tooltip-wrap">
      {children}
      <span className="game-tooltip" role="tooltip">{label}</span>
    </span>
  );
}

export function ProgressBar({ label, value, max = 1 }) {
  const ratio = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;

  return (
    <div className="game-meter" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
      <span className="game-meter-label">{label}</span>
      <span className="game-meter-track">
        <span className="game-meter-fill" style={{ width: `${ratio * 100}%` }} />
      </span>
    </div>
  );
}

export function HealthBar({ lives, maxLives }) {
  return <ProgressBar label="Health" value={lives} max={maxLives} />;
}

export function ScoreCounter({ label = "Score", score = 0 }) {
  return (
    <div className="game-stat-counter" aria-label={`${label}: ${score}`}>
      <span>{label}</span>
      <strong>{score.toLocaleString()}</strong>
    </div>
  );
}

export function Timer({ label = "Time", seconds = 0 }) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = String(safeSeconds % 60).padStart(2, "0");

  return (
    <div className="game-stat-counter" aria-label={`${label}: ${minutes}:${remainder}`}>
      <span>{label}</span>
      <strong>{minutes}:{remainder}</strong>
    </div>
  );
}

export function LevelCard({ level, locked = false, selected = false, onSelect }) {
  return (
    <button
      type="button"
      disabled={locked}
      onClick={() => onSelect(level.id)}
      className={`jungle-focus-ring level-card-primitive ${selected ? "level-card-primitive-selected" : ""}`}
    >
      <span className="level-card-primitive-kicker">{locked ? "Locked" : `Difficulty ${level.difficulty ?? 1}`}</span>
      <strong>{level.name}</strong>
      <span>{level.objective || "Reach the finish"}</span>
    </button>
  );
}

export function SettingsRow({ label, description, children }) {
  return (
    <div className="settings-toggle-row">
      <span>
        <span className="settings-toggle-label">{label}</span>
        {description ? <span className="settings-toggle-description">{description}</span> : null}
      </span>
      {children}
    </div>
  );
}

export function ConfirmDialog({ title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", onConfirm, onCancel }) {
  return (
    <GameModal title={title} kicker="Confirm" onClose={onCancel}>
      <p className="game-modal-copy">{message}</p>
      <div className="confirm-dialog-actions">
        <GameButton onClick={onCancel}>{cancelLabel}</GameButton>
        <GameButton variant="warning" onClick={onConfirm}>{confirmLabel}</GameButton>
      </div>
    </GameModal>
  );
}

export function ToastShell({ kicker, title, children }) {
  return (
    <div className="achievement-toast" role="status" aria-live="polite">
      {kicker ? <div className="achievement-toast-kicker">{kicker}</div> : null}
      <div className="achievement-toast-title">{title}</div>
      {children ? <div className="achievement-toast-copy">{children}</div> : null}
    </div>
  );
}
