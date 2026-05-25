import React, { useCallback, useEffect, useRef } from "react";

// Left cluster now uses a single charge pad with drag steering (joystick-like).
const LEFT_CLUSTER_BUTTONS = [
  { code: "ArrowUp", label: "Charge", icon: "CHARGE", hint: "Hold + drag (down = reverse)", style: "joystick" },
  { code: "ArrowDown", label: "Reverse", icon: "↩", hint: "Back up", style: "reverse" },
];

const RIGHT_CLUSTER_BUTTONS = [
  { code: "Space", label: "Jump", icon: "⤒", hint: "Jump" },
  { code: "KeyF", label: "SmashSlide", displayLabel: "Smash", icon: "💥", hint: "Hold Slide" },
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
  const chargeSteerPointerRef = useRef(null);
  const chargeSteerDirectionRef = useRef(0);
  const chargeReverseRef = useRef(false);

  const releaseAll = useCallback(() => {
    for (const [code] of activePointersByCodeRef.current.entries()) {
      onControlChange(code, false);
    }
    activePointersByCodeRef.current.clear();
    chargeSteerPointerRef.current = null;
    chargeSteerDirectionRef.current = 0;
    chargeReverseRef.current = false;
    onControlChange("ArrowLeft", false);
    onControlChange("ArrowRight", false);
    onControlChange("ArrowDown", false);
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


  const updateChargeSteer = (event) => {
    if (chargeSteerPointerRef.current !== event.pointerId) return;
    const controlRect = event.currentTarget.getBoundingClientRect();
    const centerX = controlRect.left + controlRect.width / 2;
    const offsetX = event.clientX - centerX;
    const deadZone = Math.max(18, controlRect.width * 0.14);
    const centerY = controlRect.top + controlRect.height / 2;
    const offsetY = event.clientY - centerY;

    let nextDirection = 0;
    if (offsetX < -deadZone) nextDirection = -1;
    if (offsetX > deadZone) nextDirection = 1;

    const shouldReverse = offsetY > deadZone;
    if (chargeReverseRef.current !== shouldReverse) {
      onControlChange("ArrowDown", shouldReverse);
      chargeReverseRef.current = shouldReverse;
    }

    const previousDirection = chargeSteerDirectionRef.current;
    if (previousDirection === nextDirection) return;

    if (previousDirection === -1) onControlChange("ArrowLeft", false);
    if (previousDirection === 1) onControlChange("ArrowRight", false);

    if (nextDirection === -1) onControlChange("ArrowLeft", true);
    if (nextDirection === 1) onControlChange("ArrowRight", true);

    chargeSteerDirectionRef.current = nextDirection;
  };

  const handlePointerDown = (event, code) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    addPointerPress(code, event.pointerId);
    if (code === "ArrowUp") {
      chargeSteerPointerRef.current = event.pointerId;
      updateChargeSteer(event);
    }
  };
  const handlePointerUp = (event, code) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    removePointerPress(code, event.pointerId);
    if (code === "ArrowUp" && chargeSteerPointerRef.current === event.pointerId) {
      chargeSteerPointerRef.current = null;
      if (chargeSteerDirectionRef.current === -1) onControlChange("ArrowLeft", false);
      if (chargeSteerDirectionRef.current === 1) onControlChange("ArrowRight", false);
      if (chargeReverseRef.current) onControlChange("ArrowDown", false);
      chargeSteerDirectionRef.current = 0;
      chargeReverseRef.current = false;
    }
  };
  const handlePointerCancel = (event, code) => {
    event.preventDefault();
    event.stopPropagation();
    removePointerPress(code, event.pointerId);
    if (code === "ArrowUp" && chargeSteerPointerRef.current === event.pointerId) {
      chargeSteerPointerRef.current = null;
      if (chargeSteerDirectionRef.current === -1) onControlChange("ArrowLeft", false);
      if (chargeSteerDirectionRef.current === 1) onControlChange("ArrowRight", false);
      if (chargeReverseRef.current) onControlChange("ArrowDown", false);
      chargeSteerDirectionRef.current = 0;
      chargeReverseRef.current = false;
    }
  };

  const pressStart = (event, code) => {
    event.currentTarget.dataset.pressed = "true";
    handlePointerDown(event, code);
  };

  const pressEnd = (event, code) => {
    event.currentTarget.dataset.pressed = "false";
    handlePointerUp(event, code);
  };

  const pressCancel = (event, code) => {
    event.currentTarget.dataset.pressed = "false";
    handlePointerCancel(event, code);
  };

  return (
    <div className="touch-controls mobile-controls" aria-label="Touch game controls">
      <div className="mobile-left-cluster" aria-label="Movement and charge controls">
        {LEFT_CLUSTER_BUTTONS.map(({ code, label, icon, hint, style }) => (
          <div key={`${code}-${label}`} className="touch-control-hitbox">
          <button
            type="button"
            className={`touch-control-button touch-control-${label.toLowerCase()} ${style === "joystick" ? "touch-control-joystick" : ""}`.trim()}
            aria-label={BUTTON_LABELS[label]}
            title={BUTTON_LABELS[label]}
            data-pressed="false"
            disabled={disabled}
            onContextMenu={(event) => event.preventDefault()}
            onPointerDown={(event) => pressStart(event, code)}
            onPointerUp={(event) => pressEnd(event, code)}
            onPointerMove={(event) => { if (code === "ArrowUp") updateChargeSteer(event); }}
            onPointerCancel={(event) => pressCancel(event, code)}
            onPointerLeave={(event) => pressCancel(event, code)}
          >
            {style === "joystick" ? (
              <span className="touch-control-joystick-core" aria-hidden="true">
                <span className="touch-control-joystick-arrow touch-control-joystick-arrow-left">↶</span>
                <img src={`${import.meta.env.BASE_URL}favicon.png`} alt="" className="touch-control-charge-favicon" />
                <span className="touch-control-joystick-arrow touch-control-joystick-arrow-right">↷</span>
              </span>
            ) : (
              <span className="touch-control-icon" aria-hidden="true">{icon}</span>
            )}
            <span className="touch-control-label">{label}</span>
            <span className="touch-control-hint">{hint}</span>
          </button>
          </div>
        ))}
      </div>
      <div className="mobile-right-cluster" aria-label="Action controls">
        {RIGHT_CLUSTER_BUTTONS.map(({ code, label, displayLabel, icon, hint }) => (
        <div key={`${code}-${label}`} className="touch-control-hitbox">
        <button
          type="button"
          className={`touch-control-button touch-control-${label.toLowerCase()}`}
          data-pressed="false"
          aria-label={BUTTON_LABELS[label]}
          title={BUTTON_LABELS[label]}
          disabled={disabled}
          onContextMenu={(event) => event.preventDefault()}
          onPointerDown={(event) => pressStart(event, code)}
          onPointerUp={(event) => pressEnd(event, code)}
          onPointerCancel={(event) => pressCancel(event, code)}
          onPointerLeave={(event) => pressCancel(event, code)}
        >
          <span className="touch-control-icon" aria-hidden="true">{icon}</span>
          <span className="touch-control-label">{displayLabel ?? label}</span>
          <span className="touch-control-hint">{hint}</span>
        </button>
          </div>
        ))}
      </div>
    </div>
  );
}
