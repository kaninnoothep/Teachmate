import User from "../models/users.model.js";
import Review from "../models/review.model.js";

export async function updateUserRating(userId) {
  const reviews = await Review.find({ reviewee: userId });

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

  await User.findByIdAndUpdate(userId, {
    averageRating: Number(averageRating.toFixed(1)),
    totalReviews,
  });

  return { averageRating: Number(averageRating.toFixed(1)), totalReviews };
}
