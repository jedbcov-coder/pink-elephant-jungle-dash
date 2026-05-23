import { createFreshSave, migrateSaveIfNeeded } from './saveSchema';

const SETTINGS_STORAGE_KEY = 'pinkElephant.settings';
const PROFILE_STORAGE_KEY = 'pinkElephant.profile';
const META_STORAGE_KEY = 'pinkElephant.meta';

const DB_NAME = 'pinkElephantGameDB';
const DB_VERSION = 1;

let dbPromise = null;

function safeParseJSON(rawValue, fallbackValue) {
  if (!rawValue) return fallbackValue;

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    console.warn('Failed to parse saved JSON. Falling back to default data.', error);
    return fallbackValue;
  }
}

function safeStringifyJSON(value) {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.warn('Failed to serialize save data.', error);
    return null;
  }
}

export function loadSettings() {
  try {
    const rawSettings = safeParseJSON(localStorage.getItem(SETTINGS_STORAGE_KEY), null);
    const rawProfile = safeParseJSON(localStorage.getItem(PROFILE_STORAGE_KEY), null);
    const rawMeta = safeParseJSON(localStorage.getItem(META_STORAGE_KEY), null);

    return migrateSaveIfNeeded({
      settings: rawSettings,
      profile: rawProfile,
      meta: rawMeta,
    }).settings;
  } catch (error) {
    console.warn('Failed to read settings from localStorage.', error);
    return createFreshSave().settings;
  }
}

export function saveSettings(settings) {
  try {
    const serialized = safeStringifyJSON(settings);
    if (serialized === null) return false;
    localStorage.setItem(SETTINGS_STORAGE_KEY, serialized);
    return true;
  } catch (error) {
    console.warn('Failed to save settings to localStorage.', error);
    return false;
  }
}

export function loadProfileSnapshot() {
  try {
    const rawSettings = safeParseJSON(localStorage.getItem(SETTINGS_STORAGE_KEY), null);
    const rawProfile = safeParseJSON(localStorage.getItem(PROFILE_STORAGE_KEY), null);
    const rawMeta = safeParseJSON(localStorage.getItem(META_STORAGE_KEY), null);

    return migrateSaveIfNeeded({
      settings: rawSettings,
      profile: rawProfile,
      meta: rawMeta,
    }).profile;
  } catch (error) {
    console.warn('Failed to read profile snapshot from localStorage.', error);
    return createFreshSave().profile;
  }
}

export function saveProfileSnapshot(profileSnapshot) {
  try {
    const serialized = safeStringifyJSON(profileSnapshot);
    if (serialized === null) return false;
    localStorage.setItem(PROFILE_STORAGE_KEY, serialized);
    return true;
  } catch (error) {
    console.warn('Failed to save profile snapshot to localStorage.', error);
    return false;
  }
}

function openDatabase() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains('scores')) {
        const scoreStore = db.createObjectStore('scores', { keyPath: 'id', autoIncrement: true });
        scoreStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      if (!db.objectStoreNames.contains('achievements')) {
        const achievementStore = db.createObjectStore('achievements', { keyPath: 'id' });
        achievementStore.createIndex('achievementId', 'achievementId', { unique: true });
      }

      if (!db.objectStoreNames.contains('progressionEvents')) {
        db.createObjectStore('progressionEvents', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open IndexedDB.'));
  });

  return dbPromise;
}

function runTransaction(storeName, mode, operation) {
  return openDatabase().then((db) =>
    new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);

      let operationResult;
      try {
        operationResult = operation(store, resolve, reject);
      } catch (error) {
        reject(error);
        return;
      }

      transaction.onerror = () => reject(transaction.error || new Error('IndexedDB transaction failed.'));

      if (operationResult && typeof operationResult.onsuccess === 'function') {
        operationResult.onsuccess = () => resolve(operationResult.result);
        operationResult.onerror = () => reject(operationResult.error || new Error('IndexedDB request failed.'));
      }
    })
  );
}

export async function initSaveSystem() {
  await openDatabase();

  // Keep a small metadata heartbeat so future migrations can inspect app-level info.
  const rawSettings = safeParseJSON(localStorage.getItem(SETTINGS_STORAGE_KEY), null);
  const rawProfile = safeParseJSON(localStorage.getItem(PROFILE_STORAGE_KEY), null);
  const rawMeta = safeParseJSON(localStorage.getItem(META_STORAGE_KEY), null);

  const migrated = migrateSaveIfNeeded({
    settings: rawSettings,
    profile: rawProfile,
    meta: rawMeta,
  });

  const nextMeta = {
    ...migrated.meta,
    lastInitAt: Date.now(),
  };

  const settingsSerialized = safeStringifyJSON(migrated.settings);
  if (settingsSerialized !== null) {
    localStorage.setItem(SETTINGS_STORAGE_KEY, settingsSerialized);
  }

  const profileSerialized = safeStringifyJSON(migrated.profile);
  if (profileSerialized !== null) {
    localStorage.setItem(PROFILE_STORAGE_KEY, profileSerialized);
  }

  const serialized = safeStringifyJSON(nextMeta);
  if (serialized !== null) {
    localStorage.setItem(META_STORAGE_KEY, serialized);
  }
}

export async function addScoreEntry(scoreEntry) {
  const entry = {
    ...scoreEntry,
    createdAt: scoreEntry?.createdAt || Date.now(),
  };

  return runTransaction('scores', 'readwrite', (store) => store.add(entry));
}

export async function getTopScores(limit = 10) {
  const max = Math.max(1, Number(limit) || 10);

  return runTransaction('scores', 'readonly', (store, resolve, reject) => {
    const index = store.index('createdAt');
    const request = index.openCursor(null, 'prev');
    const rows = [];

    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor || rows.length >= max) {
        resolve(rows);
        return;
      }

      rows.push(cursor.value);
      cursor.continue();
    };

    request.onerror = () => reject(request.error || new Error('Failed to load scores.'));
  });
}

export async function unlockAchievement(achievementRecord) {
  return runTransaction('achievements', 'readwrite', (store) => store.put(achievementRecord));
}

export async function listAchievements() {
  return runTransaction('achievements', 'readonly', (store) => store.getAll());
}

export async function addProgressionEvent(event) {
  return runTransaction('progressionEvents', 'readwrite', (store) => store.add(event));
}

function getAllRecordsFromStore(storeName) {
  return runTransaction(storeName, 'readonly', (store) => store.getAll());
}

function clearStore(storeName) {
  return runTransaction(storeName, 'readwrite', (store) => store.clear());
}

export async function resetAllSaveData() {
  localStorage.removeItem(SETTINGS_STORAGE_KEY);
  localStorage.removeItem(PROFILE_STORAGE_KEY);
  localStorage.removeItem(META_STORAGE_KEY);

  await Promise.all([
    clearStore('scores'),
    clearStore('achievements'),
    clearStore('progressionEvents'),
  ]);

  dbPromise = null;
}

export async function exportSaveData() {
  const rawSettings = safeParseJSON(localStorage.getItem(SETTINGS_STORAGE_KEY), null);
  const rawProfile = safeParseJSON(localStorage.getItem(PROFILE_STORAGE_KEY), null);
  const rawMeta = safeParseJSON(localStorage.getItem(META_STORAGE_KEY), null);

  const migrated = migrateSaveIfNeeded({
    settings: rawSettings,
    profile: rawProfile,
    meta: rawMeta,
  });

  const [scores, achievements, progressionEvents] = await Promise.all([
    getAllRecordsFromStore('scores'),
    getAllRecordsFromStore('achievements'),
    getAllRecordsFromStore('progressionEvents'),
  ]);

  return safeStringifyJSON({
    version: migrated.version,
    settings: migrated.settings,
    profile: migrated.profile,
    meta: migrated.meta,
    indexedDb: {
      scores,
      achievements,
      progressionEvents,
    },
    exportedAt: Date.now(),
  });
}

function isArray(value) {
  return Array.isArray(value);
}

function validateImportShape(payload) {
  if (!payload || typeof payload !== 'object') return false;
  if (!payload.settings || typeof payload.settings !== 'object') return false;
  if (!payload.profile || typeof payload.profile !== 'object') return false;
  if (!payload.meta || typeof payload.meta !== 'object') return false;
  if (!payload.indexedDb || typeof payload.indexedDb !== 'object') return false;
  if (!isArray(payload.indexedDb.scores)) return false;
  if (!isArray(payload.indexedDb.achievements)) return false;
  if (!isArray(payload.indexedDb.progressionEvents)) return false;
  return true;
}

export async function importSaveData(json) {
  const parsed = typeof json === 'string' ? safeParseJSON(json, null) : json;
  if (!validateImportShape(parsed)) {
    throw new Error('Invalid save import format.');
  }

  const migrated = migrateSaveIfNeeded({
    version: parsed.version,
    settings: parsed.settings,
    profile: parsed.profile,
    meta: parsed.meta,
  });

  const settingsSerialized = safeStringifyJSON(migrated.settings);
  const profileSerialized = safeStringifyJSON(migrated.profile);
  const metaSerialized = safeStringifyJSON({
    ...migrated.meta,
    importedAt: Date.now(),
  });

  if (settingsSerialized === null || profileSerialized === null || metaSerialized === null) {
    throw new Error('Failed to serialize imported save data.');
  }

  await Promise.all([
    clearStore('scores'),
    clearStore('achievements'),
    clearStore('progressionEvents'),
  ]);

  await Promise.all(parsed.indexedDb.scores.map((entry) => runTransaction('scores', 'readwrite', (store) => store.put(entry))));
  await Promise.all(parsed.indexedDb.achievements.map((entry) => runTransaction('achievements', 'readwrite', (store) => store.put(entry))));
  await Promise.all(parsed.indexedDb.progressionEvents.map((entry) => runTransaction('progressionEvents', 'readwrite', (store) => store.put(entry))));

  localStorage.setItem(SETTINGS_STORAGE_KEY, settingsSerialized);
  localStorage.setItem(PROFILE_STORAGE_KEY, profileSerialized);
  localStorage.setItem(META_STORAGE_KEY, metaSerialized);
}

export {
  SETTINGS_STORAGE_KEY,
  PROFILE_STORAGE_KEY,
  META_STORAGE_KEY,
};
