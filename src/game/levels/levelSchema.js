const REQUIRED_LOOP_PLAN_NUMBER_FIELDS = [
  'swayWidth',
  'guideX',
  'guideCount',
  'swayCount',
  'jumpCount',
  'highCount',
  'slideCount',
  'crateFruitCount',
  'jumpX',
  'highX',
  'crateFruitStartX',
  'crateFruitEndX',
];

const REQUIRED_LOOP_PLAN_COLLECTION_FIELDS = {
  log: 'object',
  branch: 'object',
  crates: 'array',
  river: 'object',
  health: 'object',
  enemies: 'array',
  pineapples: 'array',
};

const COURSE_NUMBER_FIELDS = ['floorLength', 'gateZ', 'finishLineZ', 'endOfCourseZ'];

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function normaliseLoopPlan(loopPlan = {}) {
  const safeLoopPlan = isObject(loopPlan) ? { ...loopPlan } : {};

  for (const field of REQUIRED_LOOP_PLAN_NUMBER_FIELDS) {
    safeLoopPlan[field] = isFiniteNumber(safeLoopPlan[field]) ? safeLoopPlan[field] : 0;
  }

  for (const [field, type] of Object.entries(REQUIRED_LOOP_PLAN_COLLECTION_FIELDS)) {
    if (type === 'array') {
      safeLoopPlan[field] = Array.isArray(safeLoopPlan[field]) ? safeLoopPlan[field] : [];
    } else {
      safeLoopPlan[field] = isObject(safeLoopPlan[field]) ? safeLoopPlan[field] : {};
    }
  }

  return safeLoopPlan;
}

export function getLevelValidationErrors(levelConfig) {
  const errors = [];

  if (!isObject(levelConfig)) {
    return ['levelConfig must exist and be an object'];
  }

  if (!isNonEmptyString(levelConfig.id)) {
    errors.push('id must be a non-empty string');
  }

  if (!isNonEmptyString(levelConfig.name)) {
    errors.push('name must be a non-empty string');
  }

  if (!isNonEmptyString(levelConfig.background)) {
    errors.push('background must be a non-empty string');
  }

  if (!Array.isArray(levelConfig.loops)) {
    errors.push('loops must be an array');
  } else if (levelConfig.loops.some((value) => !isFiniteNumber(value))) {
    errors.push('loops must contain only finite numbers');
  }

  if (!Array.isArray(levelConfig.loopPlans)) {
    errors.push('loopPlans must be an array');
  }

  if (Array.isArray(levelConfig.loops) && Array.isArray(levelConfig.loopPlans) && levelConfig.loops.length !== levelConfig.loopPlans.length) {
    errors.push('loops.length must equal loopPlans.length');
  }

  if (Array.isArray(levelConfig.loopPlans)) {
    levelConfig.loopPlans.forEach((loopPlan, index) => {
      if (!isObject(loopPlan)) {
        errors.push(`loopPlans[${index}] must be an object`);
        return;
      }

      for (const field of REQUIRED_LOOP_PLAN_NUMBER_FIELDS) {
        if (!isFiniteNumber(loopPlan[field])) {
          errors.push(`loopPlans[${index}].${field} must be a finite number`);
        }
      }

      for (const [field, type] of Object.entries(REQUIRED_LOOP_PLAN_COLLECTION_FIELDS)) {
        if (type === 'array' && !Array.isArray(loopPlan[field])) {
          errors.push(`loopPlans[${index}].${field} must be an array`);
        }

        if (type === 'object' && !isObject(loopPlan[field])) {
          errors.push(`loopPlans[${index}].${field} must be an object`);
        }
      }
    });
  }

  if (levelConfig.course !== undefined) {
    if (!isObject(levelConfig.course)) {
      errors.push('course must be an object when provided');
    } else {
      for (const field of COURSE_NUMBER_FIELDS) {
        const value = levelConfig.course[field];

        if (value !== undefined && !isFiniteNumber(value)) {
          errors.push(`course.${field} must be a finite number when provided`);
        }
      }
    }
  }

  if (!(levelConfig.nextLevel === null || typeof levelConfig.nextLevel === 'string')) {
    errors.push('nextLevel must be null or a string');
  }

  return errors;
}

export function validateLevelConfig(levelConfig) {
  return getLevelValidationErrors(levelConfig).length === 0;
}

export function normaliseLevelConfig(levelConfig) {
  const safeInput = isObject(levelConfig) ? { ...levelConfig } : {};

  const loops = Array.isArray(safeInput.loops) ? safeInput.loops.filter(isFiniteNumber) : [];
  const loopPlans = Array.isArray(safeInput.loopPlans) ? safeInput.loopPlans.map(normaliseLoopPlan) : [];
  const pairCount = Math.min(loops.length, loopPlans.length);

  const safeCourse = isObject(safeInput.course) ? { ...safeInput.course } : undefined;

  if (safeCourse) {
    for (const field of COURSE_NUMBER_FIELDS) {
      if (safeCourse[field] !== undefined && !isFiniteNumber(safeCourse[field])) {
        delete safeCourse[field];
      }
    }
  }

  return {
    ...safeInput,
    id: isNonEmptyString(safeInput.id) ? safeInput.id : '',
    name: isNonEmptyString(safeInput.name) ? safeInput.name : '',
    background: isNonEmptyString(safeInput.background) ? safeInput.background : '',
    loops: loops.slice(0, pairCount),
    loopPlans: loopPlans.slice(0, pairCount),
    course: safeCourse,
    nextLevel: safeInput.nextLevel === null || typeof safeInput.nextLevel === 'string' ? safeInput.nextLevel : null,
  };
}
