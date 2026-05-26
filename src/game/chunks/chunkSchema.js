function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

export function getChunkValidationErrors(chunk) {
  const errors = [];

  if (!isPlainObject(chunk)) {
    return ['chunk must exist and be an object'];
  }

  if (!isNonEmptyString(chunk.id)) {
    errors.push('id must be a non-empty string');
  }

  if (!isNonEmptyString(chunk.type)) {
    errors.push('type must be a non-empty string');
  }

  if (!isFiniteNumber(chunk.length) || chunk.length <= 0) {
    errors.push('length must be a finite positive number');
  }

  if (!isFiniteNumber(chunk.difficulty)) {
    errors.push('difficulty must be a finite number');
  }

  if (chunk.hazards !== undefined && !Array.isArray(chunk.hazards)) {
    errors.push('hazards must be an array when provided');
  }

  if (chunk.pickups !== undefined && !Array.isArray(chunk.pickups)) {
    errors.push('pickups must be an array when provided');
  }

  if (chunk.enemies !== undefined && !Array.isArray(chunk.enemies)) {
    errors.push('enemies must be an array when provided');
  }

  if (chunk.prompts !== undefined && !Array.isArray(chunk.prompts)) {
    errors.push('prompts must be an array when provided');
  }

  return errors;
}

export function validateChunkDefinition(chunk) {
  return getChunkValidationErrors(chunk).length === 0;
}
