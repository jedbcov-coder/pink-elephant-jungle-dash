import level1 from "./level1.js";
import level2 from "./level2.js";
import level3 from "./level3.js";
import { getLevelValidationErrors } from "./levelSchema.js";

// When adding Level 2, import `level2.js` and register it here.
export const LEVEL_REGISTRY = {
  [level1.id]: level1,
  [level2.id]: level2,
  [level3.id]: level3,
};

function warnInvalidLevelConfig(levelId, errors) {
  console.warn(
    `[levels] Ignoring invalid level config for "${levelId}". Validation errors: ${errors.join("; ")}`,
  );
}

function getValidLevelConfigOrNull(levelId) {
  const candidate = LEVEL_REGISTRY[levelId];
  if (!candidate) {
    return null;
  }

  const errors = getLevelValidationErrors(candidate);
  if (errors.length > 0) {
    warnInvalidLevelConfig(levelId, errors);
    return null;
  }

  return candidate;
}

export function getLevelConfig(levelId) {
  return getValidLevelConfigOrNull(levelId) ?? getValidLevelConfigOrNull(level1.id) ?? level1;
}

export function getLevelConfigStrict(levelId) {
  return getValidLevelConfigOrNull(levelId);
}
