import { NOTES, noteToFrequency } from "../audio.js";
import { createTitleThemePlayer } from "./titleTheme.js";
import { lerp } from "../math.js";

export const AUDIO_CATEGORY_VOLUMES = {
  music: 0.55,
  pickups: 0.78,
  impacts: 0.68,
  ui: 0.72,
};

export const DEFAULT_AUDIO_STATE = Object.freeze({
  muted: false,
  musicMuted: false,
  sfxMuted: false,
});

export function normalizeAudioState(state = {}) {
  return {
    muted: Boolean(state.muted),
    musicMuted: Boolean(state.musicMuted),
    sfxMuted: Boolean(state.sfxMuted),
  };
}

export function isAudioCategoryMuted(state, category) {
  const normalized = normalizeAudioState(state);
  if (normalized.muted) return true;
  if (category === "music") return normalized.musicMuted;
  return normalized.sfxMuted;
}

const TONE_SETTINGS = {
  jump: [180, 340, 0.08, "sine", 0.08, "ui"],
  double: [360, 720, 0.09, "triangle", 0.09, "ui"],
  land: [105, 70, 0.11, "sine", 0.1, "impacts"],
  smash: [90, 40, 0.16, "sawtooth", 0.14, "impacts"],
  fruit: [660, 990, 0.08, "triangle", 0.07, "pickups"],
  heal: [420, 760, 0.2, "sine", 0.08, "pickups"],
  hurt: [160, 80, 0.18, "square", 0.1, "impacts"],
  gate: [330, 880, 0.45, "triangle", 0.09, "ui"],
  life: [420, 980, 0.35, "triangle", 0.1, "pickups"],
  croc: [70, 45, 0.18, "sawtooth", 0.11, "impacts"],
  thump: [62, 30, 0.16, "sine", 0.08, "impacts"],
  branchWarn: [780, 520, 0.09, "triangle", 0.055, "ui"],
};

const REPEAT_RULES = {
  fruit: { skipSeconds: 0.018, softenSeconds: 0.085, minVolumeScale: 0.42 },
  thump: { skipSeconds: 0.045, softenSeconds: 0.14, minVolumeScale: 0.52 },
  hurt: { skipSeconds: 0.18, softenSeconds: 0.5, minVolumeScale: 0.62 },
  croc: { skipSeconds: 0.18, softenSeconds: 0.5, minVolumeScale: 0.62 },
};

const LAYERED_TONES = {
  slideStart: [
    [210, 112, 0.13, "triangle", 0.055, 0],
    [460, 260, 0.07, "sine", 0.035, 0.012],
  ],
  crateSmash: [
    [128, 42, 0.15, "sawtooth", 0.085, 0],
    [520, 190, 0.09, "square", 0.032, 0.018],
    [72, 36, 0.2, "sine", 0.045, 0.006],
  ],
  monkeyDefeat: [
    [760, 520, 0.09, "square", 0.034, 0],
    [980, 1320, 0.11, "triangle", 0.04, 0.035],
    [390, 260, 0.12, "sine", 0.035, 0.012],
  ],
  bonusLife: [
    [420, 630, 0.12, "sine", 0.045, 0],
    [630, 945, 0.14, "triangle", 0.052, 0.075],
    [945, 1260, 0.17, "sine", 0.046, 0.16],
  ],
};

const LAYERED_TONE_CATEGORIES = {
  slideStart: "ui",
  crateSmash: "impacts",
  monkeyDefeat: "impacts",
  bonusLife: "pickups",
};

export function resolveTonePlayback(type, atTime, lastPlayedTimes) {
  const rule = REPEAT_RULES[type];
  if (!rule) return { shouldPlay: true, volumeScale: 1 };

  const lastPlayed = lastPlayedTimes.get(type);
  if (typeof lastPlayed !== "number") return { shouldPlay: true, volumeScale: 1 };

  const secondsFromNearestScheduledPlay = Math.abs(atTime - lastPlayed);
  if (secondsFromNearestScheduledPlay < rule.skipSeconds) return { shouldPlay: false, volumeScale: 0 };

  if (secondsFromNearestScheduledPlay < rule.softenSeconds) {
    const progress = (secondsFromNearestScheduledPlay - rule.skipSeconds) / (rule.softenSeconds - rule.skipSeconds);
    const volumeScale = lerp(rule.minVolumeScale, 1, Math.max(0, Math.min(1, progress)));
    return { shouldPlay: true, volumeScale };
  }

  return { shouldPlay: true, volumeScale: 1 };
}

function getAudioContextConstructor() {
  if (typeof window === "undefined") return null;
  return window.AudioContext || window.webkitAudioContext || null;
}

function debugAudioPermission(message, error) {
  if (import.meta.env.DEV) console.debug(message, error);
}

function resumeAudioContext(context) {
  if (!context || context.state !== "suspended") return;
  context.resume().catch((error) => {
    debugAudioPermission("[audio] Audio context resume skipped.", error);
  });
}

export function createAudioManager() {
  let ctx = null;
  let master = null;
  let titleTheme = null;
  let disposed = false;
  let audioState = { ...DEFAULT_AUDIO_STATE };
  const music = { enabled: false, nextNoteTime: 0, noteIndex: 0, beatSeconds: 0.2 };
  const lastPlayedTimes = new Map();

  function applyMasterGain() {
    if (!ctx || !master) return;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(audioState.muted ? 0.0001 : 0.78, ctx.currentTime, 0.018);
  }

  function shouldPlayCategory(category) {
    return !isAudioCategoryMuted(audioState, category);
  }

  function ensureContext() {
    if (disposed) disposed = false;
    if (ctx) {
      resumeAudioContext(ctx);
      return ctx;
    }

    const AudioContext = getAudioContextConstructor();
    if (!AudioContext) return null;

    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.setValueAtTime(audioState.muted ? 0.0001 : 0.78, ctx.currentTime);
    master.connect(ctx.destination);
    resumeAudioContext(ctx);
    return ctx;
  }

  function setAudioState(nextState) {
    audioState = normalizeAudioState({ ...audioState, ...nextState });

    if (!shouldPlayCategory("music")) {
      music.enabled = false;
      titleTheme?.stop(0.08);
    } else if (ctx) {
      music.enabled = true;
      music.nextNoteTime = Math.max(music.nextNoteTime, ctx.currentTime + 0.08);
    }

    applyMasterGain();
    return getAudioState();
  }

  function getAudioState() {
    return { ...audioState };
  }

  function startAudio() {
    const audioContext = ensureContext();
    if (!audioContext) return null;
    music.enabled = shouldPlayCategory("music");
    music.nextNoteTime = audioContext.currentTime + 0.08;
    return audioContext;
  }

  function startTitleTheme(canStart = true) {
    if (!canStart || !shouldPlayCategory("music")) return;
    const audioContext = startAudio();
    if (!audioContext || !master) return;
    if (!titleTheme) titleTheme = createTitleThemePlayer(audioContext, master);
    titleTheme.start();
  }

  function stopTitleTheme(fadeSeconds = 0.22) {
    titleTheme?.stop(fadeSeconds);
  }

  function resetGameplayMusic() {
    music.nextNoteTime = ctx ? ctx.currentTime + 0.08 : 0;
    music.noteIndex = 0;
    music.beatSeconds = 0.2;
    lastPlayedTimes.clear();
  }

  function scheduleToneLayer([startFrequency, endFrequency, duration, waveform, volume, delay = 0], atTime, volumeScale = 1, category = "ui") {
    if (!ctx || !master || disposed) return;

    const startTime = atTime + delay;
    const stopTime = startTime + duration;
    const categoryVolume = AUDIO_CATEGORY_VOLUMES[category] ?? 1;
    const level = volume * categoryVolume * volumeScale;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(master);

    osc.type = waveform;
    osc.frequency.setValueAtTime(Math.max(20, startFrequency), startTime);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), stopTime);
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(level, startTime + Math.min(0.012, duration * 0.25));
    gain.gain.exponentialRampToValueAtTime(0.001, stopTime);

    osc.start(startTime);
    osc.stop(stopTime + 0.03);
  }

  function playTone(type, atTime = null) {
    if (!ctx || !master || disposed) return { played: false, reason: "unavailable" };

    const now = atTime ?? ctx.currentTime;
    const repeatDecision = resolveTonePlayback(type, now, lastPlayedTimes);
    if (!repeatDecision.shouldPlay) return { played: false, reason: "repeat-window" };

    const layeredTone = LAYERED_TONES[type];
    if (layeredTone) {
      const category = LAYERED_TONE_CATEGORIES[type] ?? "ui";
      if (!shouldPlayCategory(category)) return { played: false, reason: "muted" };

      layeredTone.forEach((layer) => scheduleToneLayer(layer, now, repeatDecision.volumeScale, category));
      lastPlayedTimes.set(type, now);
      return { played: true, volumeScale: repeatDecision.volumeScale };
    }

    const settings = TONE_SETTINGS[type] || [250, 250, 0.1, "sine", 0.05, "ui"];
    const category = settings[5];
    if (!shouldPlayCategory(category)) return { played: false, reason: "muted" };

    const categoryVolume = AUDIO_CATEGORY_VOLUMES[category] ?? 1;
    const level = settings[4] * categoryVolume * repeatDecision.volumeScale;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(master);

    osc.type = settings[3];
    osc.frequency.setValueAtTime(settings[0], now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, settings[1]), now + settings[2]);
    gain.gain.setValueAtTime(level, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + settings[2]);

    osc.start(now);
    osc.stop(now + settings[2] + 0.03);

    lastPlayedTimes.set(type, now);
    return { played: true, volumeScale: repeatDecision.volumeScale };
  }

  function updateGameplayMusic({ charge, isPlaying }) {
    if (!ctx || !master || !music.enabled || !isPlaying || disposed || !shouldPlayCategory("music")) return;

    music.beatSeconds = lerp(0.26, 0.15, charge);

    while (music.nextNoteTime < ctx.currentTime + 0.1) {
      const note = NOTES[music.noteIndex % NOTES.length];

      if (shouldPlayCategory("impacts")) playTone("thump", music.nextNoteTime);

      if (music.noteIndex % 2 === 0) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(noteToFrequency(note), music.nextNoteTime);
        gain.gain.setValueAtTime(0.025 * AUDIO_CATEGORY_VOLUMES.music, music.nextNoteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, music.nextNoteTime + 0.12);

        osc.connect(gain);
        gain.connect(master);

        osc.start(music.nextNoteTime);
        osc.stop(music.nextNoteTime + 0.14);
      }

      music.noteIndex += 1;
      music.nextNoteTime += music.beatSeconds;
    }
  }

  function getCurrentTime() {
    return ctx?.currentTime ?? 0;
  }

  function dispose({ closeContext = true } = {}) {
    disposed = true;
    music.enabled = false;
    titleTheme?.dispose();
    titleTheme = null;
    lastPlayedTimes.clear();

    try {
      master?.disconnect();
    } catch {
      // Already disconnected.
    }

    master = null;

    const audioContext = ctx;
    ctx = null;

    if (!audioContext || audioContext.state === "closed") return;

    if (closeContext && typeof audioContext.close === "function") {
      void audioContext.close().catch(() => undefined);
      return;
    }

    if (typeof audioContext.suspend === "function") void audioContext.suspend().catch(() => undefined);
  }

  return {
    startAudio,
    startTitleTheme,
    setAudioState,
    getAudioState,
    stopTitleTheme,
    playTone,
    resetGameplayMusic,
    updateGameplayMusic,
    getCurrentTime,
    dispose,
  };
}
