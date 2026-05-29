import { setKeyState } from "./input.js";

const GAMEPAD_DEADZONE = 0.35;
const GAMEPAD_CODES = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", "KeyE", "KeyF"];

export const DEFAULT_INPUT_STATUS = Object.freeze({
  gamepadSupported: false,
  gamepadConnected: false,
  gamepadName: "No gamepad detected",
  inputDevice: "keyboard/touch",
});

function isPressed(button) {
  return Boolean(button?.pressed || button?.value > 0.5);
}

export function resolveGamepadControls(gamepad, deadzone = GAMEPAD_DEADZONE) {
  const axes = gamepad?.axes ?? [];
  const buttons = gamepad?.buttons ?? [];
  const codes = new Set();
  const horizontal = Number(axes[0] ?? 0);
  const vertical = Number(axes[1] ?? 0);

  if (vertical < -deadzone || isPressed(buttons[12])) codes.add("ArrowUp");
  if (vertical > deadzone || isPressed(buttons[13])) codes.add("ArrowDown");
  if (horizontal < -deadzone || isPressed(buttons[14])) codes.add("ArrowLeft");
  if (horizontal > deadzone || isPressed(buttons[15])) codes.add("ArrowRight");
  if (isPressed(buttons[0])) codes.add("Space");
  if (isPressed(buttons[2])) codes.add("KeyE");
  if (isPressed(buttons[1]) || isPressed(buttons[3]) || isPressed(buttons[4]) || isPressed(buttons[5])) codes.add("KeyF");

  return {
    codes: Array.from(codes),
    pausePressed: isPressed(buttons[8]) || isPressed(buttons[9]),
  };
}

function getPrimaryGamepad() {
  if (typeof navigator === "undefined" || typeof navigator.getGamepads !== "function") return null;
  return Array.from(navigator.getGamepads()).find(Boolean) ?? null;
}

export function createInputManager({ onStatusChange = () => {} } = {}) {
  let previousCodes = new Set();
  let previousPausePressed = false;
  let status = {
    ...DEFAULT_INPUT_STATUS,
    gamepadSupported: typeof navigator !== "undefined" && typeof navigator.getGamepads === "function",
  };

  function publishStatus(nextStatus) {
    const changed = Object.keys(nextStatus).some((key) => nextStatus[key] !== status[key]);
    status = nextStatus;
    if (changed) onStatusChange({ ...status });
  }

  function release(keys) {
    for (const code of previousCodes) setKeyState(keys, code, false, "gamepad");
    previousCodes = new Set();
    previousPausePressed = false;
  }

  function poll(keys, { active = true, onPauseRequest = null } = {}) {
    const gamepad = getPrimaryGamepad();
    publishStatus({
      gamepadSupported: status.gamepadSupported,
      gamepadConnected: Boolean(gamepad),
      gamepadName: gamepad?.id || (status.gamepadSupported ? "No gamepad detected" : "Gamepad API unavailable"),
      inputDevice: gamepad ? "gamepad" : "keyboard/touch",
    });

    if (!gamepad || !active) {
      release(keys);
      return { ...status };
    }

    const next = resolveGamepadControls(gamepad);
    const nextCodes = new Set(next.codes);

    for (const code of GAMEPAD_CODES) {
      const shouldPress = nextCodes.has(code);
      if (shouldPress || previousCodes.has(code)) setKeyState(keys, code, shouldPress, "gamepad");
    }

    if (next.pausePressed && !previousPausePressed && typeof onPauseRequest === "function") {
      onPauseRequest();
    }

    previousCodes = nextCodes;
    previousPausePressed = next.pausePressed;
    return { ...status };
  }

  return {
    poll,
    release,
    getStatus: () => ({ ...status }),
  };
}
