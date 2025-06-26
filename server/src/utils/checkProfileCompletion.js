/**
 * Checks whether a user's profile is considered complete.
 *
 * A profile is considered complete if the user has:
 * - A profile image
 * - A phone number
 * - A selected country
 *
 * @param {Object} user - The user object to check.
 * @returns {boolean} True if the profile is complete, false otherwise.
 */
export function checkProfileCompletion(user) {
  return !!(user?.image && user?.phone && user?.country?.name);
}
