import React, { useCallback, useEffect, useRef } from "react";

const LEFT_CLUSTER_BUTTONS = [
  { code: "ArrowUp", label: "Charge", icon: "CHARGE", hint: "Hold", style: "badge" },
  { code: "ArrowLeft", label: "Left", icon: "◀", hint: "Steer" },
  { code: "ArrowRight", label: "Right", icon: "▶", hint: "Steer" },
];

const RIGHT_CLUSTER_BUTTONS = [
  { code: "Space", label: "Jump", icon: "⤒", hint: "Tap" },
  { code: "KeyF", label: "SmashSlide", icon: "💥", hint: "Tap/Hold" },
];

const BUTTON_LABELS = {
  Charge: "Hold to charge forward",
  Left: "Move left",
  Right: "Move right",
  Jump: "Jump",
  SmashSlide: "Smash or hold to slide",
};

export function TouchControls({ visible, disabled, onControlChange }) {
  if (!visible) return null;

  const activePointersByCodeRef = useRef(new Map());

  const releaseAll = useCallback(() => {
    for (const [code] of activePointersByCodeRef.current.entries()) {
      onControlChange(code, false);
    }
    activePointersByCodeRef.current.clear();
  }, [onControlChange]);

  useEffect(() => {
    if (disabled) releaseAll();
  }, [disabled, releaseAll]);

  useEffect(() => () => releaseAll(), [releaseAll]);

  const addPointerPress = (code, pointerId) => {
    if (disabled) return;
    const activePointers = activePointersByCodeRef.current.get(code) ?? new Set();
    activePointers.add(pointerId);
    activePointersByCodeRef.current.set(code, activePointers);
    onControlChange(code, true);
  };

  const removePointerPress = (code, pointerId) => {
    const activePointers = activePointersByCodeRef.current.get(code);
    if (!activePointers) return;
    activePointers.delete(pointerId);
    if (activePointers.size === 0) {
      activePointersByCodeRef.current.delete(code);
      onControlChange(code, false);
    }
  };

  const handlePointerDown = (event, code) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    addPointerPress(code, event.pointerId);
  };
  const handlePointerUp = (event, code) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    removePointerPress(code, event.pointerId);
  };
  const handlePointerCancel = (event, code) => {
    event.preventDefault();
    event.stopPropagation();
    removePointerPress(code, event.pointerId);
  };

  return (
    <div className="touch-controls mobile-controls" aria-label="Touch game controls">
      <div className="mobile-left-cluster" aria-label="Movement and charge controls">
        {LEFT_CLUSTER_BUTTONS.map(({ code, label, icon, hint, style }) => (
          <div key={`${code}-${label}`} className="touch-control-hitbox">
          <button
            type="button"
            className={`touch-control-button touch-control-${label.toLowerCase()} ${style === "badge" ? "touch-control-badge" : ""}`.trim()}
            aria-label={BUTTON_LABELS[label]}
            title={BUTTON_LABELS[label]}
            disabled={disabled}
            onContextMenu={(event) => event.preventDefault()}
            onPointerDown={(event) => handlePointerDown(event, code)}
            onPointerUp={(event) => handlePointerUp(event, code)}
            onPointerCancel={(event) => handlePointerCancel(event, code)}
            onPointerLeave={(event) => handlePointerCancel(event, code)}
          >
            <span className="touch-control-icon" aria-hidden="true">{icon}</span>
            <span className="touch-control-label">{label}</span>
            <span className="touch-control-hint">{hint}</span>
          </button>
          </div>
        ))}
      </div>
      <div className="mobile-right-cluster" aria-label="Action controls">
        {RIGHT_CLUSTER_BUTTONS.map(({ code, label, icon, hint }) => (
        <div key={`${code}-${label}`} className="touch-control-hitbox">
        <button
          type="button"
          className={`touch-control-button touch-control-${label.toLowerCase()}`}
          aria-label={BUTTON_LABELS[label]}
          title={BUTTON_LABELS[label]}
          disabled={disabled}
          onContextMenu={(event) => event.preventDefault()}
          onPointerDown={(event) => handlePointerDown(event, code)}
          onPointerUp={(event) => handlePointerUp(event, code)}
          onPointerCancel={(event) => handlePointerCancel(event, code)}
          onPointerLeave={(event) => handlePointerCancel(event, code)}
        >
          <span className="touch-control-icon" aria-hidden="true">{icon}</span>
          <span className="touch-control-label">{label}</span>
          <span className="touch-control-hint">{hint}</span>
        </button>
          </div>
        ))}
      </div>
    </div>
  );
}
