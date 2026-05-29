export const GAME_STATES = Object.freeze({
  BOOT: "boot",
  LOADING: "loading",
  TITLE: "title",
  FIRST_RUN: "first-run",
  LEVEL_INTRO: "level-intro",
  PLAYING: "playing",
  PAUSED: "paused",
  SETTINGS: "settings",
  LEVEL_SELECT: "level-select",
  LEVEL_COMPLETE: "level-complete",
  GAME_OVER: "game-over",
  CREDITS: "credits",
  ERROR: "error",
});

export const GAME_STATE_LABELS = Object.freeze({
  [GAME_STATES.BOOT]: "Boot",
  [GAME_STATES.LOADING]: "Loading",
  [GAME_STATES.TITLE]: "Title",
  [GAME_STATES.FIRST_RUN]: "First Run",
  [GAME_STATES.LEVEL_INTRO]: "Level Intro",
  [GAME_STATES.PLAYING]: "Playing",
  [GAME_STATES.PAUSED]: "Paused",
  [GAME_STATES.SETTINGS]: "Settings",
  [GAME_STATES.LEVEL_SELECT]: "Level Select",
  [GAME_STATES.LEVEL_COMPLETE]: "Level Complete",
  [GAME_STATES.GAME_OVER]: "Game Over",
  [GAME_STATES.CREDITS]: "Credits",
  [GAME_STATES.ERROR]: "Error",
});

export const LEVEL_LIFECYCLE_HOOKS = Object.freeze([
  "onLevelStart",
  "onLevelPause",
  "onLevelResume",
  "onLevelComplete",
  "onLevelFail",
  "onLevelExit",
]);

const TRANSITIONS = Object.freeze({
  [GAME_STATES.BOOT]: [GAME_STATES.LOADING, GAME_STATES.ERROR],
  [GAME_STATES.LOADING]: [GAME_STATES.TITLE, GAME_STATES.ERROR],
  [GAME_STATES.TITLE]: [GAME_STATES.FIRST_RUN, GAME_STATES.LEVEL_INTRO, GAME_STATES.LEVEL_SELECT, GAME_STATES.SETTINGS, GAME_STATES.CREDITS, GAME_STATES.ERROR],
  [GAME_STATES.FIRST_RUN]: [GAME_STATES.LEVEL_INTRO, GAME_STATES.TITLE, GAME_STATES.SETTINGS],
  [GAME_STATES.LEVEL_INTRO]: [GAME_STATES.PLAYING, GAME_STATES.LEVEL_SELECT, GAME_STATES.SETTINGS, GAME_STATES.TITLE],
  [GAME_STATES.PLAYING]: [GAME_STATES.PAUSED, GAME_STATES.SETTINGS, GAME_STATES.LEVEL_COMPLETE, GAME_STATES.GAME_OVER, GAME_STATES.ERROR],
  [GAME_STATES.PAUSED]: [GAME_STATES.PLAYING, GAME_STATES.SETTINGS, GAME_STATES.LEVEL_SELECT, GAME_STATES.TITLE, GAME_STATES.ERROR],
  [GAME_STATES.SETTINGS]: [GAME_STATES.TITLE, GAME_STATES.PAUSED, GAME_STATES.PLAYING, GAME_STATES.LEVEL_SELECT, GAME_STATES.CREDITS],
  [GAME_STATES.LEVEL_SELECT]: [GAME_STATES.TITLE, GAME_STATES.LEVEL_INTRO, GAME_STATES.PLAYING, GAME_STATES.SETTINGS, GAME_STATES.CREDITS],
  [GAME_STATES.LEVEL_COMPLETE]: [GAME_STATES.LEVEL_INTRO, GAME_STATES.LEVEL_SELECT, GAME_STATES.CREDITS, GAME_STATES.TITLE],
  [GAME_STATES.GAME_OVER]: [GAME_STATES.LEVEL_INTRO, GAME_STATES.LEVEL_SELECT, GAME_STATES.SETTINGS, GAME_STATES.TITLE],
  [GAME_STATES.CREDITS]: [GAME_STATES.TITLE, GAME_STATES.PAUSED, GAME_STATES.SETTINGS, GAME_STATES.LEVEL_SELECT],
  [GAME_STATES.ERROR]: [GAME_STATES.TITLE, GAME_STATES.LEVEL_INTRO],
});

export function canTransitionGameState(fromState, toState) {
  return Boolean(TRANSITIONS[fromState]?.includes(toState));
}

export function transitionGameState(currentState, nextState, context = {}) {
  if (currentState === nextState) {
    return { state: currentState, changed: false, reason: "same-state", context };
  }

  if (!canTransitionGameState(currentState, nextState)) {
    return { state: currentState, changed: false, reason: "blocked-transition", context };
  }

  return { state: nextState, changed: true, reason: "transitioned", context };
}

export function deriveGameShellState({
  saveSystemReady = true,
  sceneError = null,
  isLevelTransitioning = false,
  started = false,
  paused = false,
  complete = false,
  gameOver = false,
  settingsOpen = false,
  levelSelectOpen = false,
  creditsOpen = false,
} = {}) {
  if (sceneError) return GAME_STATES.ERROR;
  if (!saveSystemReady) return GAME_STATES.LOADING;
  if (settingsOpen) return GAME_STATES.SETTINGS;
  if (levelSelectOpen) return GAME_STATES.LEVEL_SELECT;
  if (creditsOpen) return GAME_STATES.CREDITS;
  if (isLevelTransitioning) return GAME_STATES.LEVEL_INTRO;
  if (complete) return GAME_STATES.LEVEL_COMPLETE;
  if (gameOver) return GAME_STATES.GAME_OVER;
  if (started && paused) return GAME_STATES.PAUSED;
  if (started) return GAME_STATES.PLAYING;
  return GAME_STATES.TITLE;
}

export function createGameStateMachine(initialState = GAME_STATES.BOOT) {
  let state = initialState;

  return {
    getState: () => state,
    transition(nextState, context = {}) {
      const result = transitionGameState(state, nextState, context);
      state = result.state;
      return result;
    },
  };
}
