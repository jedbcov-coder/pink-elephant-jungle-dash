export const LEADERBOARD_LIMIT = 20;

const MAX_ENTRIES = LEADERBOARD_LIMIT;
const INITIALS_PATTERN = /^[A-Z0-9]{3}$/;

export function normalizeInitials(value) {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 3);
}

function normalizeDate(date) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return new Date(0).toISOString();
  return parsed.toISOString();
}

function toSafeInteger(value, fallback = 0) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(0, Math.floor(number));
}

export function normalizeLeaderboardEntry(entry) {
  return {
    initials: normalizeInitials(entry?.initials),
    score: toSafeInteger(entry?.score),
    elapsedMs: toSafeInteger(entry?.elapsedMs),
    fruit: Number.isFinite(Number(entry?.fruit)) ? toSafeInteger(entry?.fruit) : undefined,
    crates: Number.isFinite(Number(entry?.crates)) ? toSafeInteger(entry?.crates) : undefined,
    lives: Number.isFinite(Number(entry?.lives)) ? toSafeInteger(entry?.lives) : undefined,
    date: normalizeDate(entry?.date ?? entry?.createdAt),
  };
}

/**
 * Deterministic leaderboard order:
 * 1. Higher score ranks first.
 * 2. Lower elapsedMs ranks first when scores match.
 * 3. Newer date ranks first as the final stable tie-breaker.
 */
export function compareLeaderboardEntries(a, b) {
  if (b.score !== a.score) return b.score - a.score;
  if (a.elapsedMs !== b.elapsedMs) return a.elapsedMs - b.elapsedMs;
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

export function rankLeaderboardEntries(entries, limit = LEADERBOARD_LIMIT) {
  return entries
    .map((entry, index) => ({ entry: normalizeLeaderboardEntry(entry), index }))
    .sort((a, b) => compareLeaderboardEntries(a.entry, b.entry) || a.index - b.index)
    .slice(0, limit)
    .map(({ entry }) => entry);
}

export function addLeaderboardEntry(entries, entry, limit = LEADERBOARD_LIMIT) {
  return rankLeaderboardEntries([...entries, entry], limit);
}

export function leaderboardResultQualifies(entries, result, limit = LEADERBOARD_LIMIT) {
  if (!result || !Number.isFinite(Number(result.score)) || !Number.isFinite(Number(result.elapsedMs))) return false;
  const rankedEntries = rankLeaderboardEntries(entries, limit);
  if (rankedEntries.length < limit) return true;

  const candidate = normalizeLeaderboardEntry({
    initials: "AAA",
    score: result.score,
    elapsedMs: result.elapsedMs,
    fruit: result.fruit,
    crates: result.crates,
    lives: result.lives,
    date: new Date().toISOString(),
  });
  return compareLeaderboardEntries(candidate, rankedEntries[rankedEntries.length - 1]) <= 0;
}

import { loginWithGoogle, auth, db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';

function sortEntries(entries) {
  return [...entries]
    .map(sanitizeLeaderboardEntry)
    .filter((entry) => validateInitials(entry.initials))
    .sort((a, b) => compareLeaderboardEntries(
      { ...a, date: a.createdAt },
      { ...b, date: b.createdAt },
    ))
    .slice(0, MAX_ENTRIES);
}

export function validateInitials(value) {
  return INITIALS_PATTERN.test(String(value ?? ""));
}

export function sanitizeLeaderboardEntry(entry) {
  return {
    initials: normalizeInitials(entry?.initials),
    score: toSafeInteger(entry?.score),
    elapsedMs: toSafeInteger(entry?.elapsedMs),
    fruit: toSafeInteger(entry?.fruit),
    crates: toSafeInteger(entry?.crates),
    lives: toSafeInteger(entry?.lives),
    createdAt: normalizeDate(entry?.createdAt ?? entry?.date ?? new Date().toISOString()),
  };
}

export function validateLeaderboardEntry(entry) {
  const safeEntry = sanitizeLeaderboardEntry(entry);
  if (!validateInitials(safeEntry.initials)) {
    return { ok: false, message: "Enter exactly 3 uppercase letters or numbers. No names, spaces, or symbols." };
  }
  return { ok: true, entry: safeEntry };
}

function normalizeRemoteRow(row) {
  return sanitizeLeaderboardEntry({
    initials: row.initials,
    score: row.score,
    elapsedMs: row.elapsedMs,
    fruit: row.fruit,
    crates: row.crates,
    lives: row.lives,
    createdAt: row.createdAt,
  });
}

async function loadRemoteLeaderboard() {
  const path = 'scores';
  try {
    const q = query(
      collection(db, path),
      orderBy('score', 'desc'),
      orderBy('elapsedMs', 'asc'),
      limit(MAX_ENTRIES)
    );
    const snapshot = await getDocs(q);
    const rows = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString()
      };
    });
    return sortEntries(rows.map(normalizeRemoteRow));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    throw error;
  }
}

async function submitRemoteLeaderboardEntry(entry) {
  if (!auth.currentUser) await loginWithGoogle();
  
  const path = 'scores';
  try {
    await addDoc(collection(db, path), {
      uid: auth.currentUser.uid,
      initials: entry.initials,
      score: entry.score,
      elapsedMs: entry.elapsedMs,
      fruit: entry.fruit,
      crates: entry.crates,
      lives: entry.lives,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
  return entry;
}

export function isLeaderboardAvailable() {
  return true;
}

export async function loadLeaderboard() {
  try {
    const entries = await loadRemoteLeaderboard();
    return { entries, source: "remote", remoteAvailable: true, error: null };
  } catch (error) {
    console.warn("Pink Elephant leaderboard remote load failed", error);
    return {
      entries: [],
      source: "remote",
      remoteAvailable: false,
      error: "Leaderboard is currently unavailable.",
    };
  }
}

export async function submitLeaderboardEntry(entry) {
  const validation = validateLeaderboardEntry(entry);
  if (!validation.ok) throw new Error(validation.message);

  const safeEntry = validation.entry;

  try {
    await submitRemoteLeaderboardEntry(safeEntry);
    const entries = await loadRemoteLeaderboard();
    return { entries, source: "remote", remoteAvailable: true, error: null };
  } catch (error) {
    console.warn("Pink Elephant leaderboard remote submit failed", error);
    return {
      entries: [],
      source: "remote",
      remoteAvailable: false,
      error: "Leaderboard submission failed. " + String(error.message || error),
    };
  }
}
