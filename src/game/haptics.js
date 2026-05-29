export const HAPTIC_PATTERNS = Object.freeze({
  ui: 8,
  action: 12,
  pickup: 18,
  impact: [45, 25, 35],
  success: [22, 45, 32],
});

export function isHapticsSupported() {
  return typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
}

export function triggerHapticFeedback(type = "ui", { enabled = true } = {}) {
  if (!enabled || !isHapticsSupported()) return false;
  const pattern = HAPTIC_PATTERNS[type] ?? HAPTIC_PATTERNS.ui;
  try {
    return Boolean(navigator.vibrate(pattern));
  } catch {
    return false;
  }
}
