import React, { useRef } from "react";

const TOUCH_CONTROL_BUTTONS = [
  { code: "ArrowUp", label: "Charge", icon: "⬆", hint: "Hold" },
  { code: "ArrowLeft", label: "Left", icon: "◀", hint: "Steer" },
  { code: "ArrowRight", label: "Right", icon: "▶", hint: "Steer" },
  { code: "Space", label: "Jump", icon: "🐘", hint: "Tap" },
  { code: "Space", label: "Slide", icon: "↧", hint: "Hold" },
  { code: "KeyF", label: "Smash", icon: "💥", hint: "Hit" },
];

export function TouchControls({ visible, onControlChange }) {
  if (!visible) return null;

  const activePointersByCodeRef = useRef(new Map());

  const addPointerPress = (code, pointerId) => {
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
    <div className="touch-controls" aria-label="Touch game controls">
      {TOUCH_CONTROL_BUTTONS.map(({ code, label, icon, hint }) => (
        <button
          key={`${code}-${label}`}
          type="button"
          className={`touch-control-button touch-control-${label.toLowerCase()}`}
          aria-label={`${label} control`}
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
      ))}
    </div>
  );
}
