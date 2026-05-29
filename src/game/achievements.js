export const ACHIEVEMENTS = Object.freeze([
  {
    id: "first-gate",
    title: "First Jungle Gate",
    description: "Finish any trail.",
  },
  {
    id: "fruit-friend",
    title: "Fruit Friend",
    description: "Collect 25 or more fruit in one run.",
  },
  {
    id: "crate-cracker",
    title: "Crate Cracker",
    description: "Smash 3 or more crates in one run.",
  },
  {
    id: "careful-herd",
    title: "Careful Herd",
    description: "Finish a run with all lives remaining.",
  },
  {
    id: "sound-on",
    title: "Sound On",
    description: "Finish a run while game audio is enabled.",
  },
  {
    id: "jungle-champion",
    title: "Jungle Champion",
    description: "Finish the final trail.",
  },
]);

export function getAchievementDefinition(id) {
  return ACHIEVEMENTS.find((achievement) => achievement.id === id) ?? null;
}

export function evaluateRunAchievements({ results, levelId, levelName, hasNextLevel, audioState }) {
  const unlocked = [];
  const score = Number(results?.score ?? 0);
  const fruit = Number(results?.fruit ?? 0);
  const crates = Number(results?.crates ?? 0);
  const lives = Number(results?.lives ?? 0);
  const audioEnabled = !(audioState?.muted || audioState?.musicMuted);

  if (score >= 0) unlocked.push("first-gate");
  if (fruit >= 25) unlocked.push("fruit-friend");
  if (crates >= 3) unlocked.push("crate-cracker");
  if (lives >= 5) unlocked.push("careful-herd");
  if (audioEnabled) unlocked.push("sound-on");
  if (!hasNextLevel) unlocked.push("jungle-champion");

  return unlocked
    .map(getAchievementDefinition)
    .filter(Boolean)
    .map((achievement) => createAchievementRecord(achievement, { levelId, levelName }));
}

export function createAchievementRecord(achievement, { levelId = "unknown", levelName = "Unknown Level", unlockedAt = Date.now() } = {}) {
  return {
    id: achievement.id,
    achievementId: achievement.id,
    title: achievement.title,
    description: achievement.description,
    levelId,
    levelName,
    unlockedAt,
  };
}

export function mergeAchievementRecords(records = []) {
  const byId = new Map();

  for (const achievement of ACHIEVEMENTS) {
    byId.set(achievement.id, {
      id: achievement.id,
      achievementId: achievement.id,
      title: achievement.title,
      description: achievement.description,
      unlocked: false,
      unlockedAt: null,
      levelName: "",
    });
  }

  for (const record of records) {
    const id = record?.achievementId ?? record?.id;
    if (!byId.has(id)) continue;
    byId.set(id, {
      ...byId.get(id),
      ...record,
      id,
      achievementId: id,
      unlocked: true,
    });
  }

  return Array.from(byId.values());
}
