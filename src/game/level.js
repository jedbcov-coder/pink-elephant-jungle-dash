import { CONFIG } from "./config.js";
import { LEVEL_SECTIONS, sectionDifficulty, sectionMetadata } from "./levelPromptMetadata.js";
import { lerp } from "./math.js";
import { getLevelConfig } from "./levels/index.js";

export { LEVEL_SECTIONS } from "./levelPromptMetadata.js";

function addFruitLine(fruits, startZ, endZ, count, localXFn, yFn, metadata = {}) {
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0 : i / (count - 1);
    const z = lerp(startZ, endZ, t);
    fruits.push({ localX: localXFn(t, z), z, y: yFn ? yFn(t, z) : 1.05, ...metadata });
  }
}

export function buildLevel(levelConfig) {
  const fruits = [], health = [], logs = [], crates = [], branches = [], rivers = [], enemies = [], collectibles = [];
  const { loops, loopPlans } = levelConfig;
  const course = {
    gateZ: levelConfig.course?.gateZ ?? CONFIG.gateZ,
    finishLineZ: levelConfig.course?.finishLineZ ?? CONFIG.finishLineZ,
    endOfCourseZ: levelConfig.course?.endOfCourseZ ?? CONFIG.endOfCourseZ,
  };

  loops.forEach((offset, index) => {
    const o = -offset;
    const plan = loopPlans[index];
    const difficulty = sectionDifficulty(index);

    // Fruit guide — loop 1 centers the teaching line; later loops bias pickups toward chosen routes.
    addFruitLine(
      fruits,
      o - 16,
      o - 52,
      plan.guideCount,
      () => plan.guideX,
      undefined,
      sectionMetadata(
        LEVEL_SECTIONS.FRUIT_GUIDE,
        difficulty,
        index === 0 ? "Follow the fruit down the center path." : undefined,
      ),
    );

    // Sway trail — loop 1 is gentle, loop 2 asks for movement, loop 3 pushes pickups off-center.
    addFruitLine(
      fruits,
      o - 66,
      o - 96,
      plan.swayCount,
      (t) => Math.sin(t * Math.PI * 2) * plan.swayWidth,
      undefined,
      sectionMetadata(LEVEL_SECTIONS.SWAY_TRAIL, difficulty),
    );

    // Jump log — fruit arc previews the log jump landing lane with more lateral demand each loop.
    addFruitLine(
      fruits,
      o - 100,
      o - 116,
      plan.jumpCount,
      () => plan.jumpX,
      (t) => 1.05 + Math.sin(t * Math.PI) * 1.5,
      sectionMetadata(
        LEVEL_SECTIONS.JUMP_LOG,
        difficulty,
        index === 0 ? "Tap jump to clear the log." : undefined,
      ),
    );

    // High fruit — rewards BIG Bounce, with loop 3 pulling the reward route away from safety.
    addFruitLine(
      fruits,
      o - 124,
      o - 140,
      plan.highCount,
      () => plan.highX,
      (t) => 1.05 + Math.sin(t * Math.PI) * 2.35,
      sectionMetadata(LEVEL_SECTIONS.HIGH_FRUIT, difficulty),
    );

    // Slide branch — low fruit line telegraphs the hold window before the branch,
    // leaving enough travel time for Space to resolve into Belly-Slide at speed.
    addFruitLine(
      fruits,
      o - (plan.branch.z - 22),
      o - (plan.branch.z - 4),
      plan.slideCount,
      () => plan.branch.localX,
      () => 0.82,
      sectionMetadata(
        LEVEL_SECTIONS.SLIDE_BRANCH,
        difficulty,
        index === 0 ? "Hold slide to belly under the branch." : undefined,
      ),
    );

    // Smash crate — route line frames safer center play in loop 1 and risk/reward sweeps later.
    addFruitLine(
      fruits,
      o - 176,
      o - 184,
      plan.crateFruitCount,
      (t) => lerp(plan.crateFruitStartX, plan.crateFruitEndX, t),
      () => 1.05,
      sectionMetadata(LEVEL_SECTIONS.SMASH_CRATE, difficulty),
    );

    logs.push({ localX: plan.log.localX, z: o - plan.log.z, width: plan.log.width, height: 1.15, depth: 1.25, section: LEVEL_SECTIONS.JUMP_LOG, difficulty });

    // Belly-slide gate: lowered clearance + wider/deeper hit volume keeps center-lane runs honest
    // and forces a true belly-slide even when entering at top speed with late jump timing.
    branches.push({
      localX: plan.branch.localX,
      z: o - plan.branch.z,
      width: plan.branch.width + 0.5, // tighter side coverage for consistent center-lane must-slide behavior
      height: 14.8,
      depth: 8.0, // longer front-to-back window so double-jump timing can't phase through
      yOffset: 9.4, // raise clearance slightly so a full belly-slide can cleanly pass under the gate
      section: LEVEL_SECTIONS.SLIDE_BRANCH,
      difficulty,
    });

    plan.crates.forEach((crate) => {
      crates.push({ localX: crate.localX, z: o - crate.z, width: 2.15, height: 2.15, depth: 2.15, section: LEVEL_SECTIONS.SMASH_CRATE, difficulty });
    });

    // River/croc — water gap plus crocodile phases for the loop's hazard tempo.
    rivers.push({
      z: o - plan.river.z, width: 15.5, depth: plan.river.depth,
      ...sectionMetadata(
        LEVEL_SECTIONS.RIVER_CROC,
        difficulty,
        index === 0 ? "Time your path through the crocodiles." : undefined,
      ),
      crocs: plan.river.crocs,
    });

    // Health recovery — post-river pickup gives breathing room after hazard damage.
    health.push({ localX: plan.health.localX, z: o - plan.health.z, section: LEVEL_SECTIONS.HEALTH_RECOVERY });

    // Monkey — one readable patrol per loop; speed/range scale by loop role.
    plan.enemies.forEach((enemy) => {
      enemies.push({ localX: enemy.localX, z: o - enemy.z, patrolRange: enemy.patrolRange, patrolSpeed: enemy.patrolSpeed, baseLocalX: enemy.localX, section: LEVEL_SECTIONS.MONKEY, difficulty });
    });

    // Pineapple — high-value collectibles, placed off the beaten path for risk/reward routing.
    plan.pineapples.forEach((pineapple) => {
      collectibles.push({ localX: pineapple.localX, z: o - pineapple.z, y: pineapple.y, section: LEVEL_SECTIONS.PINEAPPLE, difficulty });
    });
  });
  // Fruit guide finale — final generated trail into the gate approach.
  addFruitLine(
    fruits,
    Math.max(course.gateZ + 60, -700),
    course.gateZ,
    9,
    (t) => Math.sin(t * Math.PI * 2) * 2.8,
    (t) => 1.05 + Math.sin(t * Math.PI) * 0.9,
    sectionMetadata(LEVEL_SECTIONS.FRUIT_GUIDE, "finale"),
  );
  return {
    fruits,
    health,
    logs,
    crates,
    branches,
    rivers,
    enemies,
    collectibles,
    gate: { z: course.gateZ },
    finish: { z: course.finishLineZ, failSafeZ: course.endOfCourseZ },
  };
}

export function buildLevelById(levelId) {
  return buildLevel(getLevelConfig(levelId));
}

export const LEVEL = buildLevelById("level-1");
