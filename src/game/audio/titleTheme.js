const TITLE = "Tromp Through The Treetops";
const TEMPO_BPM = 152;
const STEPS_PER_BAR = 8;
const LOOKAHEAD_SECONDS = 0.18;
const SCHEDULER_MS = 45;
const NOTE_OFFSETS = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const PULSE_HARMONICS = 32;
const pulseWaveCache = new WeakMap();

const SCORE_TEXT = `
BAR 1
Pulse 1: E5 E5 G5 C6 | B5 G5 E5 G5
Pulse 2: C5 C5 E5 G5 | G5 E5 C5 E5
Triangle: C3 C3 G2 C3 | E3 E3 G2 C3
Noise: K - S K | K S - S
BAR 2
Pulse 1: A5 A5 G5 E5 | D5 E5 G5 -
Pulse 2: F5 F5 E5 C5 | B4 C5 E5 -
Triangle: F2 F2 C3 F2 | G2 G2 D3 G2
Noise: K - S K | K S - S
BAR 3
Pulse 1: E5 E5 G5 C6 | D6 C6 B5 G5
Pulse 2: C5 C5 E5 G5 | B5 G5 G5 E5
Triangle: C3 C3 G2 C3 | E3 E3 G2 C3
Noise: K - S K | K S - S
BAR 4
Pulse 1: A5 G5 E5 D5 | C5 - C5 -
Pulse 2: F5 E5 C5 B4 | C5 - C5 -
Triangle: F2 F2 G2 G2 | C3 - C3 -
Noise: K - S K | K S K S
BAR 5
Pulse 1: C6 B5 A5 G5 | E5 G5 A5 -
Pulse 2: E5 G5 F5 E5 | C5 E5 F5 -
Triangle: C3 C3 C3 G2 | A2 A2 G2 E2
Noise: K - S K | K S - S
BAR 6
Pulse 1: G5 A5 C6 D6 | C6 A5 G5 -
Pulse 2: E5 F5 A5 B5 | A5 F5 E5 -
Triangle: F2 F2 C3 F2 | G2 G2 D3 G2
Noise: K - S K | K S - S
BAR 7
Pulse 1: E5 G5 A5 C6 | E6 D6 C6 A5
Pulse 2: C5 E5 F5 A5 | C6 B5 A5 F5
Triangle: A2 A2 E3 A2 | F2 F2 C3 F2
Noise: K - S K | K S - S
BAR 8
Pulse 1: G5 E5 D5 C5 | G5 - G5 -
Pulse 2: E5 C5 B4 C5 | E5 - E5 -
Triangle: G2 G2 D3 G2 | C3 - C3 -
Noise: K - S K | K S K S
BAR 9
Pulse 1: E5 E5 G5 C6 | B5 G5 E5 G5
Pulse 2: C5 C5 E5 G5 | G5 E5 C5 E5
Triangle: C3 C3 G2 C3 | E3 E3 G2 C3
Noise: K - S K | K S - S
BAR 10
Pulse 1: A5 A5 G5 E5 | D5 E5 G5 -
Pulse 2: F5 F5 E5 C5 | B4 C5 E5 -
Triangle: F2 F2 C3 F2 | G2 G2 D3 G2
Noise: K - S K | K S - S
BAR 11
Pulse 1: C6 D6 E6 C6 | A5 G5 E5 C5
Pulse 2: G5 B5 C6 G5 | F5 E5 C5 A4
Triangle: A2 A2 E3 A2 | F2 F2 C3 F2
Noise: K - S K | K S - S
BAR 12
Pulse 1: D5 E5 G5 A5 | C6 - C6 -
Pulse 2: B4 C5 E5 F5 | G5 - G5 -
Triangle: G2 G2 D3 G2 | C3 - C3 -
Noise: K - S K | K S K S
BAR 13
Pulse 1: C6 C6 A5 C6 | D6 C6 A5 G5
Pulse 2: E5 E5 F5 E5 | F5 E5 C5 B4
Triangle: A2 A2 A2 E3 | F2 F2 C3 F2
Noise: K S S K | K S - S
BAR 14
Pulse 1: E5 G5 A5 C6 | B5 A5 G5 -
Pulse 2: C5 E5 F5 A5 | G5 F5 E5 -
Triangle: G2 G2 D3 G2 | C3 C3 G2 C3
Noise: K - S K | K S - S
BAR 15
Pulse 1: D6 D6 C6 A5 | G5 A5 C6 -
Pulse 2: F5 F5 E5 C5 | B4 C5 E5 -
Triangle: F2 F2 C3 F2 | G2 G2 D3 G2
Noise: K S S K | K S - S
BAR 16
Pulse 1: E6 D6 C6 A5 | G5 - G5 -
Pulse 2: C6 B5 A5 F5 | E5 - E5 -
Triangle: C3 C3 G2 C3 | G2 - G2 -
Noise: K - S K | K S K S
BAR 17
Pulse 1: G5 A5 B5 C6 | D6 C6 B5 G5
Pulse 2: E5 F5 G5 A5 | B5 A5 G5 E5
Triangle: C3 C3 E3 G2 | A2 A2 G2 E2
Noise: K - S K | K S - S
BAR 18
Pulse 1: A5 C6 D6 E6 | D6 C6 A5 -
Pulse 2: F5 A5 B5 C6 | B5 A5 F5 -
Triangle: F2 F2 C3 F2 | G2 G2 D3 G2
Noise: K S S K | K S - S
BAR 19
Pulse 1: E6 E6 D6 C6 | A5 G5 E5 C5
Pulse 2: C6 C6 B5 A5 | F5 E5 C5 A4
Triangle: A2 A2 E3 A2 | F2 F2 C3 F2
Noise: K - S K | K S - S
BAR 20
Pulse 1: D5 E5 G5 B5 | C6 - C6 -
Pulse 2: B4 C5 E5 G5 | E5 - E5 -
Triangle: G2 G2 D3 G2 | C3 - C3 -
Noise: K - S K | K S K S
BAR 21
Pulse 1: C6 E6 G6 E6 | C6 A5 G5 -
Pulse 2: G5 C6 E6 C6 | A5 F5 E5 -
Triangle: C3 C3 G2 C3 | A2 A2 E3 A2
Noise: K - S K | K S - S
BAR 22
Pulse 1: A5 C6 F6 E6 | D6 C6 A5 -
Pulse 2: F5 A5 C6 C6 | B5 A5 F5 -
Triangle: F2 F2 C3 F2 | G2 G2 D3 G2
Noise: K S S K | K S - S
BAR 23
Pulse 1: C6 E6 G6 E6 | C6 D6 E6 -
Pulse 2: G5 C6 E6 C6 | A5 B5 C6 -
Triangle: C3 C3 G2 C3 | E3 E3 B2 E3
Noise: K - S K | K S - S
BAR 24
Pulse 1: F6 E6 D6 C6 | G5 - G5 -
Pulse 2: C6 C6 B5 A5 | E5 - E5 -
Triangle: F2 F2 C3 F2 | G2 - G2 -
Noise: K - S K | K S K S
BAR 25
Pulse 1: E6 D6 C6 A5 | C6 A5 G5 E5
Pulse 2: C6 B5 A5 F5 | A5 F5 E5 C5
Triangle: A2 A2 E3 A2 | F2 F2 C3 F2
Noise: K - S K | K S - S
BAR 26
Pulse 1: D5 E5 G5 A5 | C6 D6 E6 -
Pulse 2: B4 C5 E5 F5 | A5 B5 C6 -
Triangle: G2 G2 D3 G2 | C3 C3 G2 C3
Noise: K S S K | K S - S
BAR 27
Pulse 1: G6 E6 C6 G5 | A5 C6 E6 C6
Pulse 2: E6 C6 G5 E5 | F5 A5 C6 A5
Triangle: C3 C3 G2 C3 | F2 F2 C3 F2
Noise: K - S K | K S - S
BAR 28
Pulse 1: D6 C6 A5 G5 | C6 - C6 -
Pulse 2: B5 A5 F5 E5 | G5 - G5 -
Triangle: G2 G2 D3 G2 | C3 - C3 -
Noise: K - S K | K S K S
BAR 29
Pulse 1: E5 G5 C6 E6 | D6 C6 A5 G5
Pulse 2: C5 E5 G5 C6 | B5 A5 F5 E5
Triangle: C3 C3 G2 C3 | F2 F2 C3 F2
Noise: K - S K | K S - S
BAR 30
Pulse 1: A5 C6 D6 F6 | E6 D6 C6 -
Pulse 2: F5 A5 B5 D6 | C6 B5 A5 -
Triangle: F2 F2 C3 F2 | G2 G2 D3 G2
Noise: K S S K | K S - S
BAR 31
Pulse 1: G5 A5 C6 E6 | G6 E6 D6 C6
Pulse 2: E5 F5 A5 C6 | E6 C6 B5 A5
Triangle: C3 C3 E3 G2 | A2 A2 F2 G2
Noise: K - S K | K S - S
BAR 32
Pulse 1: C6 G5 E5 C5 | C6 - - -
Pulse 2: E5 C5 G4 C5 | E5 - - -
Triangle: C3 G2 C3 G2 | C3 - - -
Noise: K S K S | K - - -
`;

function tokenize(pattern) {
  return pattern.replaceAll("|", " ").trim().split(/\s+/);
}

function parseScore(text) {
  return text.trim().split(/\n(?=BAR \d+)/).flatMap((block) => {
    const bar = Number(block.match(/^BAR (\d+)/)?.[1]);
    const line = (label) => block.match(new RegExp(`${label}: (.+)`))?.[1] ?? "- - - - | - - - -";
    const voices = {
      pulse1: tokenize(line("Pulse 1")),
      pulse2: tokenize(line("Pulse 2")),
      triangle: tokenize(line("Triangle")),
      noise: tokenize(line("Noise")),
    };
    return Array.from({ length: STEPS_PER_BAR }, (_, step) => ({
      bar,
      pulse1: voices.pulse1[step] ?? "-",
      pulse2: voices.pulse2[step] ?? "-",
      triangle: voices.triangle[step] ?? "-",
      noise: voices.noise[step] ?? "-",
    }));
  });
}

export const TITLE_THEME = Object.freeze({
  title: TITLE,
  tempoBpm: TEMPO_BPM,
  key: "C major",
  timeSignature: "4/4",
  sourceBars: "Full 32-bar score; bars 21-24 are the strongest hook inside the loop.",
  stepsPerBar: STEPS_PER_BAR,
  sequence: parseScore(SCORE_TEXT),
});

export function noteNameToFrequency(note) {
  const match = /^([A-G])(#|b)?(\d)$/.exec(note);
  if (!match) return null;
  const [, letter, accidental, octaveText] = match;
  const accidentalOffset = accidental === "#" ? 1 : accidental === "b" ? -1 : 0;
  const midi = 12 * (Number(octaveText) + 1) + NOTE_OFFSETS[letter] + accidentalOffset;
  return 440 * 2 ** ((midi - 69) / 12);
}

function getPulseWave(ctx, dutyCycle) {
  let waves = pulseWaveCache.get(ctx);
  if (!waves) {
    waves = new Map();
    pulseWaveCache.set(ctx, waves);
  }
  if (waves.has(dutyCycle)) return waves.get(dutyCycle);

  const real = new Float32Array(PULSE_HARMONICS + 1);
  const imag = new Float32Array(PULSE_HARMONICS + 1);
  for (let harmonic = 1; harmonic <= PULSE_HARMONICS; harmonic += 1) {
    imag[harmonic] = (2 / (harmonic * Math.PI)) * Math.sin(harmonic * Math.PI * dutyCycle);
  }

  const wave = ctx.createPeriodicWave(real, imag, { disableNormalization: false });
  waves.set(dutyCycle, wave);
  return wave;
}

function schedulePitchedNote(ctx, output, note, time, duration, options) {
  if (note === "-") return;
  const frequency = noteNameToFrequency(note);
  if (!frequency) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  if (options.dutyCycle) {
    osc.setPeriodicWave(getPulseWave(ctx, options.dutyCycle));
  } else {
    osc.type = options.wave;
  }
  osc.frequency.setValueAtTime(frequency, time);
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(options.volume, time + 0.012);
  gain.gain.setValueAtTime(options.volume, time + Math.max(0.012, duration * options.hold));
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
  osc.connect(gain).connect(output);
  osc.start(time);
  osc.stop(time + duration + 0.03);
}

function makeNoiseBuffer(ctx, duration) {
  const length = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function schedulePercussion(ctx, output, symbol, time) {
  if (symbol === "-") return;
  if (symbol === "K") {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(96, time);
    osc.frequency.exponentialRampToValueAtTime(42, time + 0.08);
    gain.gain.setValueAtTime(0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.11);
    osc.connect(gain).connect(output);
    osc.start(time);
    osc.stop(time + 0.13);
    return;
  }

  if (symbol === "S") {
    const noise = ctx.createBufferSource();
    const highpass = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    noise.buffer = makeNoiseBuffer(ctx, 0.09);
    highpass.type = "highpass";
    highpass.frequency.setValueAtTime(1200, time);
    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.085);
    noise.connect(highpass).connect(gain).connect(output);
    noise.start(time);
    noise.stop(time + 0.1);
  }
}

function scheduleStep(ctx, output, event, time, stepSeconds) {
  schedulePitchedNote(ctx, output, event.pulse1, time, stepSeconds * 0.84, { wave: "square", dutyCycle: 0.25, volume: 0.045, hold: 0.58 });
  schedulePitchedNote(ctx, output, event.pulse2, time, stepSeconds * 0.74, { wave: "square", dutyCycle: 0.125, volume: 0.026, hold: 0.45 });
  schedulePitchedNote(ctx, output, event.triangle, time, stepSeconds * 0.62, { wave: "triangle", volume: 0.052, hold: 0.28 });
  schedulePercussion(ctx, output, event.noise, time);
}

export function createTitleThemePlayer(ctx, output = ctx.destination) {
  const stepSeconds = 60 / TEMPO_BPM / 2;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, ctx.currentTime);
  master.connect(output);

  let timer = null;
  let playing = false;
  let stepIndex = 0;
  let nextStepTime = 0;

  function scheduler() {
    if (!playing) return;
    while (nextStepTime < ctx.currentTime + LOOKAHEAD_SECONDS) {
      scheduleStep(ctx, master, TITLE_THEME.sequence[stepIndex], nextStepTime, stepSeconds);
      stepIndex = (stepIndex + 1) % TITLE_THEME.sequence.length;
      nextStepTime += stepSeconds;
    }
  }

  function start() {
    if (playing) return;
    if (ctx.state === "suspended") {
      ctx.resume().catch((error) => {
        if (import.meta.env.DEV) console.debug("[audio] Title theme resume skipped.", error);
      });
    }
    playing = true;
    stepIndex = 0;
    nextStepTime = ctx.currentTime + 0.05;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.82, ctx.currentTime + 0.18);
    scheduler();
    timer = window.setInterval(scheduler, SCHEDULER_MS);
  }

  function stop(fadeSeconds = 0.22) {
    if (!playing) return;
    playing = false;
    if (timer) window.clearInterval(timer);
    timer = null;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + fadeSeconds);
  }

  function dispose() {
    stop(0.05);
    try {
      master.disconnect();
    } catch {
      // Already disconnected.
    }
  }

  return { start, stop, dispose, get playing() { return playing; } };
}
