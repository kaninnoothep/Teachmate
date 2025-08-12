/**
 * Import Modules
 */
import User from "../models/users.model.js";
import Review from "../models/review.model.js";

/**
 * Updates a user's average rating and total review count.
 *
 * @param {string} userId - The ID of the user whose rating should be updated.
 * @returns {Promise<{ averageRating: number, totalReviews: number }>} - The updated average rating and total number of reviews.
 */
export async function updateUserRating(userId) {
  // Find all reviews where the given user is the reviewee
  const reviews = await Review.find({ reviewee: userId });

  // Total number of reviews
  const totalReviews = reviews.length;

  // Calculate average rating if there are reviews, otherwise default to 0
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

  // Update the user's record with the new rating and review count
  await User.findByIdAndUpdate(userId, {
    averageRating: Number(averageRating.toFixed(1)), // round to 1 decimal
    totalReviews,
  });

  // Return updated averageRating and totalReviews
  return { averageRating: Number(averageRating.toFixed(1)), totalReviews };
}
