export const SAVE_SCHEMA_VERSION = 1;

export const defaultSettings = {
  audio: {
    masterEnabled: true,
    musicEnabled: true,
    sfxEnabled: true,
  },
  controls: {
    touchControlsEnabled: true,
    vibrationEnabled: true,
  },
  accessibility: {
    highContrastEnabled: false,
    reduceMotionEnabled: false,
  },
};

export const defaultProfile = {
  unlockedSkins: ['default'],
  selectedSkin: 'default',
  progression: {
    highestLevel: 1,
    totalRuns: 0,
    totalFruit: 0,
  },
  stats: {
    bestScore: 0,
    totalScore: 0,
  },
};

export function createFreshSave() {
  return {
    version: SAVE_SCHEMA_VERSION,
    settings: structuredClone(defaultSettings),
    profile: structuredClone(defaultProfile),
    meta: {
      lastInitAt: 0,
      saveSystemVersion: SAVE_SCHEMA_VERSION,
    },
  };
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function deepMergePreservingUnknown(defaultValue, rawValue) {
  if (Array.isArray(defaultValue)) {
    return Array.isArray(rawValue) ? rawValue : structuredClone(defaultValue);
  }

  if (!isPlainObject(defaultValue)) {
    return rawValue === undefined ? defaultValue : rawValue;
  }

  const base = isPlainObject(rawValue) ? { ...rawValue } : {};

  for (const key of Object.keys(defaultValue)) {
    base[key] = deepMergePreservingUnknown(defaultValue[key], base[key]);
  }

  return base;
}

export function migrateSaveIfNeeded(rawData) {
  const incoming = isPlainObject(rawData) ? rawData : {};
  const fresh = createFreshSave();

  const migrated = {
    ...incoming,
    version: SAVE_SCHEMA_VERSION,
    settings: deepMergePreservingUnknown(fresh.settings, incoming.settings),
    profile: deepMergePreservingUnknown(fresh.profile, incoming.profile),
    meta: deepMergePreservingUnknown(fresh.meta, incoming.meta),
  };

  return migrated;
}
