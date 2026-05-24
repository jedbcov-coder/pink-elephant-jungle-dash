import { CONFIG } from "./config.js";
import { aabb, clamp, lerp } from "./math.js";
import { worldX } from "./track.js";

export function makeBoxCollider(source, target = {}) {
  target.minX = source.x - source.w / 2;
  target.maxX = source.x + source.w / 2;
  target.minY = source.y - source.h / 2;
  target.maxY = source.y + source.h / 2;
  target.minZ = source.z - source.d / 2;
  target.maxZ = source.z + source.d / 2;
  return target;
}

export function playerBox(nx, ny, nz, sliding = false, target = {}) {
  const hw = (CONFIG.playerSize * CONFIG.hitboxScale) / 2;
  const hh = sliding ? CONFIG.playerSize * 0.25 : (CONFIG.playerSize * CONFIG.hitboxScale) / 2;
  const hd = (CONFIG.playerSize * CONFIG.hitboxScale) / 2;
  target.minX = nx - hw;
  target.maxX = nx + hw;
  target.minY = ny - hh;
  target.maxY = ny + hh;
  target.minZ = nz - hd;
  target.maxZ = nz + hd;
  return target;
}

export function obstacleBox(obs, target = {}) {
  return makeBoxCollider(obs, target);
}

export function radiusBox(item, target = {}) {
  target.minX = item.x - item.radius;
  target.maxX = item.x + item.radius;
  target.minY = item.y - item.radius;
  target.maxY = item.y + item.radius;
  target.minZ = item.z - item.radius;
  target.maxZ = item.z + item.radius;
  return target;
}

export function enemyBox(enemy, target = {}) {
  target.minX = enemy.x - enemy.w / 2;
  target.maxX = enemy.x + enemy.w / 2;
  target.minY = 0;
  target.maxY = enemy.h;
  target.minZ = enemy.z - enemy.d / 2;
  target.maxZ = enemy.z + enemy.d / 2;
  return target;
}

export function branchHitsPlayer(playerAabb, branchAabb) {
  // Branches are overhead gates: once AABB overlap exists, only vertical clearance decides hit vs clean slide.
  return playerAabb.maxY >= branchAabb.minY;
}

export function zOverlapDepth(a, b) {
  return b.maxZ - a.minZ;
}

export function canRetreatFromObstacle(currentBox, nextBox, obstacleAabb, isReversing = true) {
  if (!isReversing || !aabb(currentBox, obstacleAabb)) return false;
  return zOverlapDepth(nextBox, obstacleAabb) < zOverlapDepth(currentBox, obstacleAabb) - 0.001;
}

export function sweptObstaclePlayerBox({
  obstacleAabb,
  currentBox,
  nextBox,
  body,
  nextLocalX,
  nextY,
  nextZ,
  contactBox = {},
  projectX = worldX,
}) {
  const forward = body.speed > 0 && currentBox.minZ > obstacleAabb.maxZ && nextBox.minZ <= obstacleAabb.maxZ;
  const backward = body.speed < 0 && currentBox.maxZ < obstacleAabb.minZ && nextBox.maxZ >= obstacleAabb.minZ;
  if (!forward && !backward) return null;

  const halfDepth = (nextBox.maxZ - nextBox.minZ) / 2;
  const contactZ = forward ? obstacleAabb.maxZ + halfDepth : obstacleAabb.minZ - halfDepth;
  const travelZ = nextZ - body.z;
  const t = Math.abs(travelZ) > 0.00001 ? clamp((contactZ - body.z) / travelZ, 0, 1) : 1;
  const contactLocalX = lerp(body.localX, nextLocalX, t);
  const contactY = lerp(body.y, nextY, t);
  const contactX = projectX(contactLocalX, contactZ);
  playerBox(contactX, contactY, contactZ, body.slideTimer > 0, contactBox);

  return aabb(contactBox, obstacleAabb) ? contactBox : null;
}

export function smashBox(nx, ny, nz, target = {}) {
  target.minX = nx - CONFIG.smashRange;
  target.maxX = nx + CONFIG.smashRange;
  target.minY = 0;
  target.maxY = ny + 2.4;
  target.minZ = nz - CONFIG.smashRange * 1.4;
  target.maxZ = nz + CONFIG.smashRange * 0.35;
  return target;
}

export function handleLogCollision({ collisionBox, obstacleAabb, canRetreat = false }) {
  const hits = collisionBox.minY < obstacleAabb.maxY - 0.18;
  return { hurt: hits && !canRetreat, blocked: hits && !canRetreat };
}

export function handleBranchCollision({ collisionBox, obstacleAabb, canRetreat = false }) {
  const hits = aabb(collisionBox, obstacleAabb) && branchHitsPlayer(collisionBox, obstacleAabb);
  return { hurt: hits && !canRetreat, blocked: hits && !canRetreat };
}

export function handleCrateCollision({ charge = 0, smashActionActive = false, canRetreat = false }) {
  if (charge >= CONFIG.smashChargeThreshold || smashActionActive) return { breakCrate: true, blocked: false };
  return { hurt: !canRetreat, blocked: !canRetreat };
}

export function handleCrocCollision({ canRetreat = false }) {
  return { hurt: !canRetreat, blocked: !canRetreat, croc: true };
}

export function handleGateCollision({ playing = true, complete = false, currentZ = Infinity, nextZ, finishZ, failSafeZ }) {
  if (!playing || complete) return false;
  const crossedGatePlane = currentZ > finishZ && nextZ <= finishZ;
  const crossedFailSafe = currentZ > failSafeZ && nextZ <= failSafeZ;
  return crossedGatePlane || crossedFailSafe;
}

export const COLLISION_HANDLERS = {
  log: handleLogCollision,
  branch: handleBranchCollision,
  crate: handleCrateCollision,
  croc: handleCrocCollision,
  gate: handleGateCollision,
};
