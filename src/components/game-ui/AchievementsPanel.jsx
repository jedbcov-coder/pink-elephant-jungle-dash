import React from "react";
import { mergeAchievementRecords } from "../../game/achievements.js";

export function AchievementsPanel({ records = [] }) {
  const achievements = mergeAchievementRecords(records);
  const unlockedCount = achievements.filter((achievement) => achievement.unlocked).length;

  return (
    <div className="achievements-panel">
      <div className="achievements-summary">
        <span>Unlocked</span>
        <strong>{unlockedCount}/{achievements.length}</strong>
      </div>
      <div className="achievements-list" aria-label="Achievements">
        {achievements.map((achievement) => (
          <div key={achievement.id} className={`achievement-row ${achievement.unlocked ? "is-unlocked" : ""}`}>
            <span className="achievement-medal" aria-hidden="true">{achievement.unlocked ? "*" : "-"}</span>
            <span>
              <span className="achievement-title">{achievement.title}</span>
              <span className="achievement-description">
                {achievement.unlocked
                  ? `Unlocked${achievement.levelName ? ` in ${achievement.levelName}` : ""}.`
                  : achievement.description}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
