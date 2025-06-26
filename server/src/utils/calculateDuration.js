/**
 * Calculates the duration in hours between two time strings.
 *
 * Time strings must be in the format "HH:mm".
 * Returns a decimal representing the number of hours between the two times.
 *
 * @param {string} start - The start time (e.g., "08:30").
 * @param {string} end - The end time (e.g., "10:00").
 * @returns {number} The duration between the start and end time in hours.
 */
function calculateDuration(start, end) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return (eh * 60 + em - sh * 60 - sm) / 60;
}

// Export the function
export { calculateDuration };
