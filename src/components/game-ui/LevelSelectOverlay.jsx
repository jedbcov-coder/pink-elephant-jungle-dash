import React, { useEffect } from "react";

function getDifficultyLabel(level, index) {
  const loopCount = Array.isArray(level.loops) ? level.loops.length : 0;
  const maxSpeed = Number(level.speed?.maxSpeed ?? 0);

  if (index === 0 || loopCount <= 3) return "Intro";
  if (maxSpeed >= 42 || loopCount >= 5) return "Advanced";
  return "Medium";
}

function getObjective(level) {
  const distance = Math.abs(Number(level.course?.finishLineZ ?? level.goalDistance ?? 0));
  const roundedDistance = Number.isFinite(distance) && distance > 0 ? `${Math.round(distance)}m` : "the finish gate";
  return `Reach the Jungle Gate across ${roundedDistance} while keeping lives and score alive.`;
}

export function LevelSelectOverlay({
  open,
  levels,
  currentLevelId,
  isBusy,
  onClose,
  onStartLevel,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <section className="game-modal-overlay pointer-events-auto absolute inset-0 z-40 flex items-center justify-center px-4 sm:px-6" aria-modal="true" role="dialog" aria-labelledby="level-select-title">
      <div className="game-modal-card level-select-modal">
        <div className="game-modal-header">
          <div>
            <div className="game-modal-kicker">Level Select</div>
            <h2 id="level-select-title" className="display-title game-modal-title">Choose a Trail</h2>
            <p className="game-modal-copy">Template default: every game starts with a reusable level picker and clear per-level briefing.</p>
          </div>
          <button type="button" onClick={onClose} className="jungle-focus-ring jungle-menu-button-secondary game-modal-close">Close</button>
        </div>

        <div className="level-select-grid" aria-label="Playable levels">
          {levels.map((level, index) => {
            const difficulty = getDifficultyLabel(level, index);
            const isCurrent = level.id === currentLevelId;
            const nextLabel = level.nextLevel ? `Next: ${level.nextLevel}` : "Final trail";

            return (
              <article key={level.id} className={`level-select-card ${isCurrent ? "is-current-level" : ""}`}>
                <div className="level-select-card-topline">
                  <span>{difficulty}</span>
                  {isCurrent ? <span>Current</span> : null}
                </div>
                <h3>{level.name}</h3>
                <p>{getObjective(level)}</p>
                <dl className="level-select-meta">
                  <div>
                    <dt>Theme</dt>
                    <dd>{level.background}</dd>
                  </div>
                  <div>
                    <dt>Loops</dt>
                    <dd>{Array.isArray(level.loops) ? level.loops.length : 0}</dd>
                  </div>
                  <div>
                    <dt>Progress</dt>
                    <dd>{nextLabel}</dd>
                  </div>
                </dl>
                <button type="button" onClick={() => onStartLevel(level.id)} disabled={isBusy} className="jungle-focus-ring jungle-menu-button-primary level-select-action">
                  {isBusy ? "Loading..." : `Start ${level.name}`}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
