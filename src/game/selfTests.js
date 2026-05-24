import { aabb, clamp, createSeededRandom, lerp } from "./math.js";
import {
  branchHitsPlayer,
  handleBranchCollision,
  handleCrateCollision,
  handleGateCollision,
  handleLogCollision,
  makeBoxCollider,
  obstacleBox,
  playerBox,
  smashBox,
} from "./collisionHelpers.js";
import { applyComboScore, applyFruitLifeCounter } from "./fruitLife.js";
import { createKeys, setKeyState } from "./input.js";
import { isAudioCategoryMuted, normalizeAudioState, resolveTonePlayback } from "./audio/audioManager.js";
import { TITLE_THEME, noteNameToFrequency } from "./audio/titleTheme.js";
import { trackAngle, trackCenter, worldPosition, worldX } from "./track.js";
import { CONFIG, MOVEMENT, PICKUPS, SCORING } from "./config.js";
import { buildLevelById, LEVEL } from "./level.js";
import { getLevelConfig } from "./levels/index.js";
import level2 from "./levels/level2.js";
import level3 from "./levels/level3.js";
import { LOOP_DIFFICULTIES, LOOP_PROMPT_PLANS, LEVEL_SECTIONS, promptPlanHasCue, sectionDifficulty, sectionMetadata } from "./levelPromptMetadata.js";
import { LEVEL_PROMPTS, promptForZ } from "./prompts.js";
import {
  createPlayerBody,
  selectPlayerStateLabel,
} from "./player.js";
import {
  getPlayerInputIntent,
  tickPlayerTimers,
  triggerJumpOrDoubleJump,
  updateJumpAndSlideInput,
  updatePlayerAir,
  updatePlayerSpeed,
  updatePlayerSteering,
} from "./movement.js";

export function runSelfTests() {
  const results = [];
  const assert = (name, condition) => results.push({ name, pass: Boolean(condition) });

  assert("clamp caps high values", clamp(12, 0, 10) === 10);
  assert("clamp caps low values", clamp(-2, 0, 10) === 0);
  assert("lerp halfway", lerp(0, 10, 0.5) === 5);

  const seededA = createSeededRandom(1234);
  const seededB = createSeededRandom(1234);
  const seededC = createSeededRandom(4321);
  const seededSequenceA = Array.from({ length: 8 }, () => seededA());
  const seededSequenceB = Array.from({ length: 8 }, () => seededB());
  const seededSequenceC = Array.from({ length: 8 }, () => seededC());

  assert(
    "seeded RNG repeats the same organic sequence for a seed",
    seededSequenceA.every((value, index) => value === seededSequenceB[index] && value >= 0 && value < 1),
  );
  assert(
    "seeded RNG changes sequence for a different seed",
    seededSequenceA.some((value, index) => value !== seededSequenceC[index]),
  );

  assert(
    "aabb detects overlap",
    aabb(
      { minX: 0, maxX: 2, minY: 0, maxY: 2, minZ: 0, maxZ: 2 },
      { minX: 1, maxX: 3, minY: 1, maxY: 3, minZ: 1, maxZ: 3 },
    ),
  );

  assert(
    "aabb detects separation",
    !aabb(
      { minX: 0, maxX: 1, minY: 0, maxY: 1, minZ: 0, maxZ: 1 },
      { minX: 2, maxX: 3, minY: 2, maxY: 3, minZ: 2, maxZ: 3 },
    ),
  );

  assert(
    "worldX honours local offset",
    Math.abs(worldX(2, -50) - trackCenter(-50) - 2 * Math.cos(trackAngle(-50))) < 0.00001,
  );

  assert(
    "worldPosition uses shared path projection",
    worldPosition(0, -120).x === trackCenter(-120) && worldPosition(0, -120).z === -120,
  );

  const samples = Array.from({ length: 77 }, (_, i) => trackCenter(-i * 10));
  const minCenter = Math.min(...samples);
  const maxCenter = Math.max(...samples);
  const maxReadableAngle = Math.max(...samples.map((_, i) => Math.abs(trackAngle(-i * 10))));

  assert("track has visible left-right bends", maxCenter - minCenter > 12);
  assert("track bends stay readable", maxReadableAngle < 0.35);

  const builtLevel1 = buildLevelById("level-1");
  const builtLevel2 = buildLevelById("level-2");
  const builtLevel3 = buildLevelById("level-3");

  assert(
    "level 1 finish/gate match configured globals",
    builtLevel1.finish.z === CONFIG.finishLineZ
      && builtLevel1.gate.z === CONFIG.gateZ
      && CONFIG.finishLineZ === CONFIG.gateZ,
  );
  assert(
    "level 2 finish/gate use level overrides after build",
    builtLevel2.finish.z === level2.course.finishLineZ
      && builtLevel2.gate.z === level2.course.gateZ
      && builtLevel2.finish.z === builtLevel2.gate.z,
  );
  assert("level finish failsafe is beyond the gate", LEVEL.finish.failSafeZ < LEVEL.finish.z);

  assert("level 2 id stays level-2", level2.id === "level-2");
  assert("getLevelConfig resolves level-2", getLevelConfig("level-2")?.id === "level-2");
  assert("level 3 id stays level-3", level3.id === "level-3");
  assert("level 3 finish/gate use level overrides after build", builtLevel3.finish.z === level3.course.finishLineZ && builtLevel3.gate.z === level3.course.gateZ && builtLevel3.finish.z === builtLevel3.gate.z);
  assert("getLevelConfig resolves level-3", getLevelConfig("level-3")?.id === "level-3");

  ["level-1", "level-2", "level-3"].forEach((levelId) => {
    const builtLevel = buildLevelById(levelId);
    const requiredSections = [
      "fruits",
      "logs",
      "crates",
      "branches",
      "rivers",
      "enemies",
      "collectibles",
      "gate",
      "finish",
    ];

    requiredSections.forEach((section) => {
      const hasSection = builtLevel[section] !== undefined;
      const hasEntries = ["gate", "finish"].includes(section)
        ? Boolean(builtLevel[section])
        : Array.isArray(builtLevel[section]) && builtLevel[section].length > 0;

      assert(`level ${levelId} builds with ${section}`, hasSection && hasEntries);
    });
  });

  const representativeLog = LEVEL.logs[0];
  assert("level has at least one log obstacle", Boolean(representativeLog));
  if (representativeLog) {
    const representativeLogPosition = worldPosition(representativeLog.localX, representativeLog.z);
    const representativeLogBox = obstacleBox({
      x: representativeLogPosition.x,
      y: representativeLog.height / 2,
      z: representativeLogPosition.z,
      w: representativeLog.width,
      h: representativeLog.height,
      d: representativeLog.depth,
    });
    const jumpingLogPlayerBox = playerBox(
      representativeLogPosition.x,
      representativeLog.height - 0.17 + (CONFIG.playerSize * CONFIG.hitboxScale) / 2,
      representativeLogPosition.z,
      false,
    );
    const logResult = handleLogCollision({ collisionBox: jumpingLogPlayerBox, obstacleAabb: representativeLogBox });
    assert(
      "log jump clearance avoids damage while overlapping horizontally",
      aabb(jumpingLogPlayerBox, representativeLogBox) && !logResult.hurt && !logResult.blocked,
    );
  }

  const directBox = makeBoxCollider({ x: 4, y: 5, z: 6, w: 2, h: 4, d: 6 });
  assert(
    "makeBoxCollider expands center dimensions into AABB extents",
    directBox.minX === 3 && directBox.maxX === 5 && directBox.minY === 3 && directBox.maxY === 7 && directBox.minZ === 3 && directBox.maxZ === 9,
  );

  const representativeBranch = LEVEL.branches[0];
  assert("level has at least one branch obstacle", Boolean(representativeBranch));
  if (representativeBranch) {
    const representativeBranchPosition = worldPosition(representativeBranch.localX, representativeBranch.z);
    const representativeBranchBox = obstacleBox({
      x: representativeBranchPosition.x,
      y: representativeBranch.yOffset,
      z: representativeBranchPosition.z,
      w: representativeBranch.width,
      h: representativeBranch.height,
      d: representativeBranch.depth,
    });
    const standingBranchPlayerBox = playerBox(
      representativeBranchPosition.x,
      representativeBranchBox.minY - (CONFIG.playerSize * CONFIG.hitboxScale) / 2 + 0.02,
      representativeBranchPosition.z,
      false,
    );
    const slidingBranchPlayerBox = playerBox(
      representativeBranchPosition.x,
      CONFIG.playerSize / 2,
      representativeBranchPosition.z,
      true,
    );

    assert(
      "standing player clips representative branch",
      aabb(standingBranchPlayerBox, representativeBranchBox) && branchHitsPlayer(standingBranchPlayerBox, representativeBranchBox),
    );
    assert(
      "sliding player box clears representative branch",
      !aabb(slidingBranchPlayerBox, representativeBranchBox) && !branchHitsPlayer(slidingBranchPlayerBox, representativeBranchBox),
    );
    const branchSlideResult = handleBranchCollision({ collisionBox: slidingBranchPlayerBox, obstacleAabb: representativeBranchBox });
    assert(
      "branch slide clearance handler avoids damage",
      !branchSlideResult.hurt && !branchSlideResult.blocked,
    );

    const standingBranchCollision = handleBranchCollision({ collisionBox: standingBranchPlayerBox, obstacleAabb: representativeBranchBox });
    assert(
      "branch handler blocks standing player in overlap window",
      standingBranchCollision.hurt && standingBranchCollision.blocked,
    );

    const nearFrontZ = representativeBranchPosition.z + representativeBranch.depth / 2 - (CONFIG.playerSize * CONFIG.hitboxScale) / 2;
    const nearBackZ = representativeBranchPosition.z - representativeBranch.depth / 2 + (CONFIG.playerSize * CONFIG.hitboxScale) / 2;
    const branchStandY = representativeBranchBox.minY - (CONFIG.playerSize * CONFIG.hitboxScale) / 2 + 0.02;
    const frontStandingPlayerBox = playerBox(representativeBranchPosition.x, branchStandY, nearFrontZ, false);
    const backStandingPlayerBox = playerBox(representativeBranchPosition.x, branchStandY, nearBackZ, false);
    const frontSlidingPlayerBox = playerBox(representativeBranchPosition.x, CONFIG.playerSize / 2, nearFrontZ, true);
    const backSlidingPlayerBox = playerBox(representativeBranchPosition.x, CONFIG.playerSize / 2, nearBackZ, true);

    assert(
      "branch depth window still catches standing player at front/back edges",
      aabb(frontStandingPlayerBox, representativeBranchBox)
        && aabb(backStandingPlayerBox, representativeBranchBox)
        && branchHitsPlayer(frontStandingPlayerBox, representativeBranchBox)
        && branchHitsPlayer(backStandingPlayerBox, representativeBranchBox),
    );
    assert(
      "branch depth window still clears sliding player at front/back edges",
      !aabb(frontSlidingPlayerBox, representativeBranchBox)
        && !aabb(backSlidingPlayerBox, representativeBranchBox)
        && !branchHitsPlayer(frontSlidingPlayerBox, representativeBranchBox)
        && !branchHitsPlayer(backSlidingPlayerBox, representativeBranchBox),
    );
  }
  assert(
    "branch challenge repeats at expected z sections",
    [-148, -393, -638].every((z) => LEVEL.branches.some((branch) => branch.z === z)),
  );
  assert(
    "slide fruit appears before each branch timing window",
    LEVEL.branches.every((branch) => LEVEL.fruits.some((fruit) => (
      fruit.section === "slide branch"
        && fruit.z > branch.z
        && fruit.z - branch.z <= 24
        && Math.abs(fruit.localX - branch.localX) < 0.001
    ))),
  );

  const representativeCrate = LEVEL.crates[0];
  assert("level has at least one smash crate", Boolean(representativeCrate));
  if (representativeCrate) {
    const representativeCratePosition = worldPosition(representativeCrate.localX, representativeCrate.z);
    const representativeCrateBox = obstacleBox({
      x: representativeCratePosition.x,
      y: representativeCrate.height / 2,
      z: representativeCratePosition.z,
      w: representativeCrate.width,
      h: representativeCrate.height,
      d: representativeCrate.depth,
    });
    const crateSmashRange = smashBox(representativeCratePosition.x, CONFIG.playerSize / 2, representativeCratePosition.z + CONFIG.smashRange, {});
    const crateSmashResult = handleCrateCollision({ charge: 0, smashActionActive: true });
    assert(
      "crate smash range overlaps and handler breaks crate",
      aabb(crateSmashRange, representativeCrateBox) && crateSmashResult.breakCrate && !crateSmashResult.blocked,
    );
  }

  assert(
    "finish trigger behaviour completes when crossing the gate plane only while playing",
    handleGateCollision({ playing: true, complete: false, currentZ: LEVEL.finish.z + 1, nextZ: LEVEL.finish.z, finishZ: LEVEL.finish.z, failSafeZ: LEVEL.finish.failSafeZ })
      && !handleGateCollision({ playing: false, complete: false, currentZ: LEVEL.finish.z + 1, nextZ: LEVEL.finish.z, finishZ: LEVEL.finish.z, failSafeZ: LEVEL.finish.failSafeZ })
      && !handleGateCollision({ playing: true, complete: true, currentZ: LEVEL.finish.z + 1, nextZ: LEVEL.finish.z, finishZ: LEVEL.finish.z, failSafeZ: LEVEL.finish.failSafeZ })
      && !handleGateCollision({ playing: true, complete: false, currentZ: LEVEL.finish.z - 1, nextZ: LEVEL.finish.z - 2, finishZ: LEVEL.finish.z, failSafeZ: LEVEL.finish.failSafeZ })
      && !handleGateCollision({ playing: true, complete: false, currentZ: LEVEL.finish.z + 2, nextZ: LEVEL.finish.z + 1, finishZ: LEVEL.finish.z, failSafeZ: LEVEL.finish.failSafeZ }),
  );


  assert(
    "level prompt metadata exposes loop difficulty progression",
    LOOP_DIFFICULTIES.join(",") === "intro,building,advanced"
      && sectionDifficulty(0) === "intro"
      && sectionDifficulty(1) === "building"
      && sectionDifficulty(2) === "advanced"
      && sectionDifficulty(7) === "advanced",
  );
  const metadataSample = sectionMetadata(LEVEL_SECTIONS.SLIDE_BRANCH, sectionDifficulty(0), "Slide soon");
  assert(
    "level prompt metadata creates section tutorial records",
    metadataSample.section === LEVEL_SECTIONS.SLIDE_BRANCH
      && metadataSample.difficulty === "intro"
      && metadataSample.tutorialPrompt === "Slide soon",
  );
  assert(
    "loop prompt plans preserve core tutorial cues",
    LOOP_PROMPT_PLANS.length === 3
      && promptPlanHasCue(LOOP_PROMPT_PLANS[0], "log")
      && promptPlanHasCue(LOOP_PROMPT_PLANS[2], "river"),
  );

  const promptCueAppearsBefore = (cue, targetZ) => {
    const prompt = LEVEL_PROMPTS.find((candidate) => candidate.cues.includes(cue) && candidate.startZ > targetZ);
    return Boolean(prompt) && promptForZ(prompt.startZ - 0.1) === prompt.text;
  };
  const firstFruit = LEVEL.fruits[0];
  assert("fruit prompt appears before the first fruit", Boolean(firstFruit) && promptCueAppearsBefore("fruit", firstFruit.z));
  assert("log prompt appears before the first log", Boolean(LEVEL.logs[0]) && promptCueAppearsBefore("log", LEVEL.logs[0].z));
  assert("branch prompt appears before the first branch", Boolean(LEVEL.branches[0]) && promptCueAppearsBefore("branch", LEVEL.branches[0].z));
  assert("crate prompt appears before the first crate", Boolean(LEVEL.crates[0]) && promptCueAppearsBefore("crate", LEVEL.crates[0].z));
  assert("river prompt appears before the first river", Boolean(LEVEL.rivers[0]) && promptCueAppearsBefore("river", LEVEL.rivers[0].z));
  assert("finish prompt appears before the finish line", promptCueAppearsBefore("finish", LEVEL.finish.z));

  assert("title theme contains all 32 bars", TITLE_THEME.sequence.length === TITLE_THEME.stepsPerBar * 32);
  assert("title theme hook starts at bar 21", TITLE_THEME.sequence[20 * TITLE_THEME.stepsPerBar].bar === 21);
  assert(
    "title theme keeps four polyphonic lanes",
    ["pulse1", "pulse2", "triangle", "noise"].every((voice) => voice in TITLE_THEME.sequence[0]),
  );
  assert("title theme note conversion tunes A4", Math.abs(noteNameToFrequency("A4") - 440) < 0.00001);

  const persistedAudio = normalizeAudioState({ muted: 1, musicMuted: 0, sfxMuted: "yes" });
  assert(
    "audio state normalizes persisted mute flags",
    persistedAudio.muted === true && persistedAudio.musicMuted === false && persistedAudio.sfxMuted === true,
  );
  assert(
    "audio mute gates first-gesture title autoplay for muted and unmuted states",
    isAudioCategoryMuted({ muted: true, musicMuted: false, sfxMuted: false }, "music")
      && isAudioCategoryMuted({ muted: false, musicMuted: true, sfxMuted: false }, "music")
      && !isAudioCategoryMuted({ muted: false, musicMuted: false, sfxMuted: false }, "music"),
  );
  assert(
    "audio state can separately mute sfx without muting music",
    isAudioCategoryMuted({ muted: false, musicMuted: false, sfxMuted: true }, "impacts")
      && !isAudioCategoryMuted({ muted: false, musicMuted: false, sfxMuted: true }, "music"),
  );

  const denseFruitTimes = new Map([["fruit", 10]]);
  const denseFruitSkipped = resolveTonePlayback("fruit", 10.01, denseFruitTimes);
  const denseFruitSoftened = resolveTonePlayback("fruit", 10.05, denseFruitTimes);
  const spacedFruitFull = resolveTonePlayback("fruit", 10.12, denseFruitTimes);
  assert(
    "dense fruit pickup lines skip immediate repeats and soften near-overlaps",
    !denseFruitSkipped.shouldPlay
      && denseFruitSoftened.shouldPlay
      && denseFruitSoftened.volumeScale > 0
      && denseFruitSoftened.volumeScale < 1
      && spacedFruitFull.shouldPlay
      && spacedFruitFull.volumeScale === 1,
  );

  const stampedeThumpTimes = new Map([["thump", 22]]);
  const stampedeThumpSkipped = resolveTonePlayback("thump", 22.03, stampedeThumpTimes);
  const stampedeThumpSoftened = resolveTonePlayback("thump", 22.13, stampedeThumpTimes);
  const stampedeNearScheduledMusic = resolveTonePlayback("thump", 21.93, stampedeThumpTimes);
  assert(
    "stampede thumps avoid harsh overlap at full charge cadence",
    !stampedeThumpSkipped.shouldPlay
      && stampedeThumpSoftened.shouldPlay
      && stampedeThumpSoftened.volumeScale > 0.5
      && stampedeThumpSoftened.volumeScale < 1
      && stampedeNearScheduledMusic.shouldPlay
      && stampedeNearScheduledMusic.volumeScale < 1,
  );

  const repeatedHurtTimes = new Map([["hurt", 30]]);
  const repeatedHurtSkipped = resolveTonePlayback("hurt", 30.1, repeatedHurtTimes);
  const repeatedHurtSoftened = resolveTonePlayback("hurt", 30.3, repeatedHurtTimes);
  assert(
    "hurt sounds throttle repeated damage feedback",
    !repeatedHurtSkipped.shouldPlay && repeatedHurtSoftened.shouldPlay && repeatedHurtSoftened.volumeScale < 1,
  );

  const fruitProgress = applyFruitLifeCounter(25, PICKUPS.fruitLifeAmount);
  assert(
    "fruit life progress advances by the normal fruit amount",
    fruitProgress.livesAwarded === 0 && fruitProgress.counter === 26,
  );

  const negativeFruitProgress = applyFruitLifeCounter(-10, -5);
  assert(
    "fruit life progress ignores negative counter and pickup values",
    negativeFruitProgress.livesAwarded === 0 && negativeFruitProgress.counter === 0,
  );

  const multiLifeProgress = applyFruitLifeCounter(95, 205);
  assert(
    "fruit life progress can award multiple bonus lives and keep remainder",
    multiLifeProgress.livesAwarded === 3 && multiLifeProgress.counter === 0,
  );

  const pineappleAt80 = applyFruitLifeCounter(80, SCORING.pineappleFruitLifeAmount);
  assert("golden pineapple awards a bonus life at 80 fruit", pineappleAt80.livesAwarded === 1 && pineappleAt80.counter === 0);

  const pineappleAbove80 = applyFruitLifeCounter(85, SCORING.pineappleFruitLifeAmount);
  assert("golden pineapple carries fruit progress after crossing 100", pineappleAbove80.livesAwarded === 1 && pineappleAbove80.counter === 5);

  const normalFruitAt99 = applyFruitLifeCounter(99, PICKUPS.fruitLifeAmount);
  assert("normal fruit bonus life threshold still resets at 100", normalFruitAt99.livesAwarded === 1 && normalFruitAt99.counter === 0);

  let scoreState = createPlayerBody();
  scoreState = { ...scoreState, ...applyComboScore(scoreState, SCORING.fruitPoints) };
  assert(
    "score helper adds base fruit points at the current multiplier",
    scoreState.score === SCORING.fruitPoints
      && scoreState.multiplierCombo === 1
      && scoreState.multiplier === 1
      && scoreState.multiplierTimer === SCORING.comboWindowSeconds,
  );

  for (let i = 1; i < SCORING.comboPerMultiplier; i++) {
    scoreState = { ...scoreState, ...applyComboScore(scoreState, SCORING.fruitPoints) };
  }
  assert(
    "combo helper raises the multiplier after enough chained pickups",
    scoreState.multiplierCombo === SCORING.comboPerMultiplier && scoreState.multiplier === 2,
  );

  const doubledFruitScore = applyComboScore(scoreState, SCORING.fruitPoints);
  assert(
    "combo helper uses the active multiplier for the next score increment",
    doubledFruitScore.pointsAwarded === SCORING.fruitPoints * 2
      && doubledFruitScore.score === scoreState.score + SCORING.fruitPoints * 2,
  );

  const longerComboWindow = applyComboScore({ ...scoreState, multiplierTimer: 1 }, SCORING.cratePoints, SCORING.crateComboWindowSeconds);
  assert(
    "combo helper can extend special pickup combo windows",
    longerComboWindow.multiplierTimer === SCORING.crateComboWindowSeconds,
  );

  const steeringBody = createPlayerBody({ localX: CONFIG.corridorHalfWidth - 0.1 });
  const steeringKeys = createKeys();
  setKeyState(steeringKeys, "ArrowRight", true);
  const clampedLocalX = updatePlayerSteering(steeringBody, steeringKeys, 1, true, steeringBody.z);
  assert(
    "movement helper clamps steering within corridor",
    clampedLocalX === CONFIG.corridorHalfWidth && steeringBody.yaw !== 0,
  );

  const comboBody = createPlayerBody({ grounded: false, coyoteTimer: 0.08, multiplier: 3, multiplierCombo: 9, multiplierTimer: 0.01 });
  tickPlayerTimers(comboBody, 0.1);
  assert(
    "movement helper expires coyote and multiplier timers",
    comboBody.coyoteTimer <= 0.000001 && comboBody.multiplier === 1 && comboBody.multiplierCombo === 0,
  );

  const bufferedAirBody = createPlayerBody({ grounded: false, yVelocity: -2, jumpBufferTimer: 0.05 });
  const bufferedAir = updatePlayerAir(bufferedAirBody, CONFIG.playerSize / 2 + 0.01, 0.1);
  assert(
    "movement helper consumes buffered jump on landing",
    bufferedAir.landed && bufferedAir.bufferedJump && !bufferedAirBody.grounded && bufferedAirBody.yVelocity === MOVEMENT.jumpVelocity,
  );

  const jumpBody = createPlayerBody();
  const jumpEvent = triggerJumpOrDoubleJump(jumpBody, true);
  assert(
    "player helper starts a ground jump",
    jumpEvent === "ground" && !jumpBody.grounded && jumpBody.yVelocity === MOVEMENT.jumpVelocity && jumpBody.jumpBufferTimer === 0,
  );

  const doubleJumpBody = createPlayerBody({ grounded: false, coyoteTimer: 0, doubleUsed: false });
  const doubleJumpEvent = triggerJumpOrDoubleJump(doubleJumpBody, true);
  assert(
    "player helper starts a double jump while airborne",
    doubleJumpEvent === "double" && doubleJumpBody.doubleUsed && doubleJumpBody.yVelocity === MOVEMENT.doubleJumpVelocity,
  );

  const slideBody = createPlayerBody({ speed: 8 });
  const slideKeys = createKeys();
  setKeyState(slideKeys, "Space", true);
  const slideEvents = updateJumpAndSlideInput(slideBody, slideKeys, MOVEMENT.slideHoldThreshold, true);
  assert(
    "player helper converts held Space into slide",
    slideEvents.includes("slide") && slideBody.slideTimer === MOVEMENT.slideDuration && !slideBody.bufferedSlide,
  );

  const reverseBody = createPlayerBody();
  const reverseKeys = createKeys();
  setKeyState(reverseKeys, "ArrowDown", true);
  const reverseIntent = getPlayerInputIntent(reverseBody, reverseKeys, true);
  updatePlayerSpeed(reverseBody, 0.5, true, reverseIntent);
  assert(
    "player helper accelerates reverse from rest",
    reverseIntent.wantsReverse && reverseBody.speed < 0 && reverseBody.speed >= -MOVEMENT.reverseMaxSpeed,
  );

  const fastReverseBody = createPlayerBody({ speed: 8 });
  const fastReverseKeys = createKeys();
  setKeyState(fastReverseKeys, "ArrowDown", true);
  const fastReverseIntent = getPlayerInputIntent(fastReverseBody, fastReverseKeys, true);
  updatePlayerSpeed(fastReverseBody, 0.2, true, fastReverseIntent);
  assert(
    "ArrowDown reverses instead of starting a high-speed slide",
    fastReverseIntent.wantsReverse && fastReverseBody.slideTimer === 0 && fastReverseBody.speed < 8,
  );

  assert(
    "player state labels prioritise action states",
    selectPlayerStateLabel(createPlayerBody({ spinTimer: 0.2, slideTimer: 0.7 }), 0) === "Spin Attack"
      && selectPlayerStateLabel(createPlayerBody({ slideTimer: 0.7 }), 0) === "Belly-Slide"
      && selectPlayerStateLabel(createPlayerBody({ grounded: false, doubleUsed: true }), 0) === "BIG Bounce",
  );

  assert(
    "player state labels include speed and end states",
    selectPlayerStateLabel(createPlayerBody({ speed: MOVEMENT.maxSpeed }), 1) === "Mighty Charge"
      && selectPlayerStateLabel(createPlayerBody({ completed: true, lives: 0 }), 0) === "Jungle Gate"
      && selectPlayerStateLabel(createPlayerBody({ lives: 0 }), 0) === "Herd Resting",
  );

  const keys = createKeys();

  setKeyState(keys, "KeyW", true);
  assert("W mirrors ArrowUp", keys.ArrowUp);

  setKeyState(keys, "KeyA", true);
  assert("A mirrors ArrowLeft", keys.ArrowLeft);

  setKeyState(keys, "KeyS", true);
  assert("S mirrors ArrowDown", keys.ArrowDown);

  setKeyState(keys, "KeyD", true);
  assert("D mirrors ArrowRight", keys.ArrowRight);

  setKeyState(keys, "ShiftLeft", true);
  assert("Shift no longer mirrors Space", !keys.Space && keys.ShiftLeft);

  setKeyState(keys, "Space", true);
  setKeyState(keys, "ShiftRight", true);
  setKeyState(keys, "ShiftRight", false);
  assert("Space remains held independently of Shift", keys.Space);

  return results;
}
