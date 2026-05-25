export const MOVEMENT = {
  acceleration: 4.3,
  maxSpeed: 40,
  reverseAcceleration: 5.2,
  reverseMaxSpeed: 7.5,
  friction: 2.5,
  idleDeceleration: 18,
  minSpeed: 0.05,
  steerSpeed: 10.5,
  turnDamping: 13,
  steeringYawLean: -0.22,
  slideStartMinSpeed: 2,
  gravity: -32,
  fallGravityMultiplier: 1.58,
  coyoteTime: 0.13,
  jumpBufferTime: 0.14,
  jumpVelocity: 13.5,
  doubleJumpVelocity: 12.25,
  slideDuration: 0.72,
  slideHoldThreshold: 0.35,
  smashActionDuration: 0.18,
  smashFeedbackDuration: 0.1,
  spinDuration: 0.55,
  mightyChargeThreshold: 0.82,
  movingStateMinSpeed: 0.5,
};

export const SCORING = {
  fruitPoints: 5,
  cratePoints: 10,
  monkeyPoints: 20,
  pineapplePoints: 50,
  comboWindowSeconds: 3.0,
  crateComboWindowSeconds: 3.5,
  maxMultiplier: 5,
  comboPerMultiplier: 5,
  fruitLifeThreshold: 100,
  pineappleFruitLifeAmount: 20,
};

export const HUD_TIMING = {
  lowFrequencyRefreshFps: 12,
  speedometerRedrawDelta: 0.01,
};

export const PERFORMANCE = {
  sampleWindowMs: 2500,
  lowFpsThreshold: 52,
  veryLowFpsThreshold: 46,
  obstacleHeavyDistance: 65,
  obstacleHeavyCount: 7,
};

export const PARTICLES = {
  defaultBurstCount: 8,
  hurtBurstScale: 0.25,
  crateWoodCount: 13,
  crateSparkleCount: 5,
  fruitCollectCount: 4,
  healBurstCount: 10,
  monkeyBurstCount: 14,
  monkeySparkleCount: 6,
  pineappleBurstCount: 16,
  pineappleSparkleCount: 8,
  gravityScale: 0.12,
  decayRate: 1.7,
  growthRate: 1.5,
};

export const PICKUPS = {
  fruitLifeAmount: 1,
  healthRestore: 25,
  fruitRadius: 0.78,
  healthRadius: 0.95,
  pineappleRadius: 0.9,
};

export const COLLISION = {
  hitboxScale: 0.66,
  slidingHitboxHeightScale: 0.25,
  retreatOverlapEpsilon: 0.001,
  smashChargeThreshold: 0.65,
  smashRange: 2.5,
  smashForwardScale: 1.4,
  smashBackScale: 0.35,
};

export const CAMERA_FEEDBACK = {
  cameraFov: 58,
  highChargeFov: 66,
  cameraHeight: 6.8,
  cameraDistance: 12.4,
  cameraLerp: 0.1,
  fovSnapEpsilon: 0.01,
  fovLerp: 0.04,
  hurtShake: 0.42,
  chargeShake: 0.045,
  chargeDistanceBoost: 2,
  lookAheadBase: 26,
  lookAheadChargeBoost: 8,
  lookAheadLocalScale: 0.35,
  lookAheadLerp: 0.42,
  lookAtHeightOffset: 1.4,
};

export const CONFIG = {
  floorLength: 900,
  floorWidth: 32,
  corridorHalfWidth: 5.6,
  startZ: 6,
  gateZ: -760,
  finishLineZ: -760,
  finishTriggerDepth: 10,
  endOfCourseZ: -782,
  playerSize: 2.05,
  ...MOVEMENT,
  ...COLLISION,
  ...CAMERA_FEEDBACK,
};
