import level1 from './level1.js';
import { LEVEL_REGISTRY } from './index.js';
import { getLevelValidationErrors, normaliseLevelConfig, validateLevelConfig } from './levelSchema.js';

const FALLBACK_LEVEL_ID = level1.id;

function getRawLevelConfig(levelId) {
  if (typeof levelId !== 'string') {
    return null;
  }

  return LEVEL_REGISTRY[levelId] ?? null;
}

function validateAndNormaliseLevel(levelConfig, sourceLevelId = 'unknown') {
  if (validateLevelConfig(levelConfig)) {
    return normaliseLevelConfig(levelConfig);
  }

  const validationErrors = getLevelValidationErrors(levelConfig);
  console.warn(
    `[levels] Invalid level config for "${sourceLevelId}".`,
    validationErrors,
  );

  return null;
}

export function loadLevelConfigStrict(levelId) {
  const rawConfig = getRawLevelConfig(levelId);

  if (!rawConfig) {
    return null;
  }

  return validateAndNormaliseLevel(rawConfig, levelId);
}

export function loadLevelConfig(levelId) {
  const strictConfig = loadLevelConfigStrict(levelId);

  if (strictConfig) {
    return strictConfig;
  }

  if (levelId !== FALLBACK_LEVEL_ID) {
    console.warn(
      `[levels] Falling back to "${FALLBACK_LEVEL_ID}" for level id "${String(levelId)}".`,
    );
  }

  const fallbackConfig = loadLevelConfigStrict(FALLBACK_LEVEL_ID);

  if (fallbackConfig) {
    return fallbackConfig;
  }

  console.warn(
    `[levels] Fallback level "${FALLBACK_LEVEL_ID}" is invalid. Returning normalised fallback source as a last resort.`,
  );

  return normaliseLevelConfig(level1);
}

export function getNextLevelId(levelId) {
  const config = loadLevelConfigStrict(levelId);
  return config?.nextLevel ?? null;
}

export function hasNextLevel(levelId) {
  const nextLevelId = getNextLevelId(levelId);
  return typeof nextLevelId === 'string' && nextLevelId.trim().length > 0;
}

export function isChunkLevel(levelId) {
  const config = loadLevelConfigStrict(levelId);
  return config?.chunkMode === true;
}
