/**
 * Checks if two time slots are the same by comparing their start and end times.
 *
 * @param {Object} a - First time slot object with `startTime` and `endTime`.
 * @param {Object} b - Second time slot object with `startTime` and `endTime`.
 * @returns {boolean} True if both time slots have the same start and end times, otherwise false.
 */
export const isSameSlot = (a, b) =>
  a.startTime === b.startTime && a.endTime === b.endTime;
