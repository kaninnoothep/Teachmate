import responses from "../utils/response.js";
import Booking from "../models/booking.model.js";
import Review from "../models/review.model.js";

async function canReview(user, otherUserId) {
  if (!otherUserId) {
    return responses.buildFailureResponse("Missing otherUserId", 400);
  }

  const finishedBooking = await Booking.findOne({
    $or: [
      { tutor: user._id, student: otherUserId },
      { tutor: otherUserId, student: user._id },
    ],
    status: "finished",
  });

  return responses.buildSuccessResponse("Check complete", 200, {
    canReview: !!finishedBooking,
  });
}

async function addReview(user, data) {
  const { revieweeId, rating, title, reviewMessage } = data;

  if (!revieweeId || !rating) {
    return responses.buildFailureResponse("Missing required fields", 400);
  }

  if (revieweeId === user._id) {
    return responses.buildFailureResponse("You cannot review yourself", 400);
  }

  //   const alreadyReviewed = await Review.findOne({
  //     reviewer: user._id,
  //     reviewee: revieweeId,
  //   });

  //   if (alreadyReviewed) {
  //     return responses.buildFailureResponse(
  //       "You already reviewed this user",
  //       400
  //     );
  //   }

  const review = await Review.create({
    reviewer: user._id,
    reviewee: revieweeId,
    rating,
    title,
    reviewMessage,
  });

  return responses.buildSuccessResponse(
    "Review added successfully",
    201,
    review
  );
}

async function replyToReview(user, reviewId, replyMessage) {
  const review = await Review.findById(reviewId);

  console.log("review.reply", review.reply);

  if (!review) {
    return responses.buildFailureResponse("Review not found", 404);
  }

  if (review.reply) {
    return responses.buildFailureResponse("Review already has a reply", 400);
  }

  review.reply = {
    author: user._id,
    replyMessage,
    createdAt: new Date(),
  };

  await review.save();

  return responses.buildSuccessResponse(
    "Reply added successfully",
    200,
    review
  );
}

async function deleteReview(user, reviewId) {
  const review = await Review.findById(reviewId);

  if (!review) {
    return responses.buildFailureResponse("Review not found", 404);
  }

  if (!review.reviewer.equals(user._id)) {
    return responses.buildFailureResponse(
      "Unauthorized to delete this review",
      403
    );
  }

  await review.deleteOne();

  return responses.buildSuccessResponse("Review deleted successfully", 200);
}

async function deleteReply(user, reviewId) {
  const review = await Review.findById(reviewId);

  if (!review || !review.reply) {
    return responses.buildFailureResponse("Reply not found", 404);
  }

  if (!review.reply.author.equals(user._id)) {
    return responses.buildFailureResponse(
      "Unauthorized to delete this reply",
      403
    );
  }

  review.reply = null;
  await review.save();

  return responses.buildSuccessResponse(
    "Reply deleted successfully",
    200,
    review
  );
}

async function getReviews(userId) {
  const reviews = await Review.find({ reviewee: userId })
    .populate("reviewer", "_id firstName lastName image role")
    .populate("reviewee", "_id firstName lastName image role")
    .populate("reply.author", "_id firstName lastName image role")
    .sort({ createdAt: -1 });

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  return {
    reviews,
    totalReviews,
    averageRating: Number(averageRating.toFixed(1)),
  };
}

/**
 * Export all functions
 */
export default {
  canReview,
  addReview,
  replyToReview,
  deleteReview,
  deleteReply,
  getReviews,
};
