import { sortByEndDate } from "./sortByEndDate.js";

/**
 * Helper function to populate and sort user data
 *
 * @param {Query} query - Mongoose query object
 * @returns {Object} - User object with sorted education and experience
 */
async function populateUserData(query) {
  const user = await query.populate("education").populate("experience");

  if (user) {
    if (user.education) {
      user.education = sortByEndDate(user.education);
    }
    if (user.experience) {
      user.experience = sortByEndDate(user.experience);
    }
  }

  return user;
}

export { populateUserData };
