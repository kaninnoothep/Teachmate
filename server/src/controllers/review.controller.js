/**
 * Import modules
 */
import reviewServices from "../services/review.services.js";

/**
 * canReview - Check if a user can review on the other user
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
async function canReview(req, res) {
  try {
    const response = await reviewServices.canReview(
      req.user,
      req.query.otherUserId
    );
    res.status(response.statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Unable to check review eligibility",
      status: "failure",
    });
  }
}

/**
 * addReview - Add a review on a user
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
async function addReview(req, res) {
  try {
    const response = await reviewServices.addReview(req.user, req.body);
    res.status(response.statusCode).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unable to add the review", status: "failure" });
  }
}

/**
 * replyToReview - Reply to a review
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
async function replyToReview(req, res) {
  try {
    const response = await reviewServices.replyToReview(
      req.user,
      req.params.reviewId,
      req.body.replyMessage
    );
    res.status(response.statusCode).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unable to reply to review", status: "failure" });
  }
}

/**
 * deleteReview - Delete an existing review
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
async function deleteReview(req, res) {
  try {
    const response = await reviewServices.deleteReview(
      req.user,
      req.params.reviewId
    );
    res.status(response.statusCode).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unable to delete review", status: "failure" });
  }
}

/**
 * deleteReply - Delete an existing reply
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
async function deleteReply(req, res) {
  try {
    const response = await reviewServices.deleteReply(
      req.user,
      req.params.reviewId
    );
    res.status(response.statusCode).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unable to delete reply", status: "failure" });
  }
}

/**
 * getReviews - Retrieve all reviews of a user by the user's ID
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
async function getReviews(req, res) {
  try {
    const response = await reviewServices.getReviews(req.params.userId);
    res.status(200).json({
      message: "Reviews fetched successfully",
      status: "success",
      data: response,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unable to fetch reviews", status: "failure" });
  }
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
