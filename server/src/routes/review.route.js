/**
 * Import Modules
 */
import express from "express";
import reviewControllers from "../controllers/review.controller.js";
import authMiddleware from "../middlewares/auth.js";

// Define Router object for all /review routes
const router = express.Router();

// Check if the user can review
// GET request to /can-review
router.get(
  "/can-review",
  authMiddleware.authenticate,
  reviewControllers.canReview
);

// Add a review
// POST request to /
router.post("/", authMiddleware.authenticate, reviewControllers.addReview);

// Reply to a review by ID
// POST request to /:reviewId/reply
router.post(
  "/:reviewId/reply",
  authMiddleware.authenticate,
  reviewControllers.replyToReview
);

// Delete a review by ID
// DELETE request to /:reviewId
router.delete(
  "/:reviewId",
  authMiddleware.authenticate,
  reviewControllers.deleteReview
);

// Delete a reply by review ID
// DELETE request to /:reviewId/reply
router.delete(
  "/:reviewId/reply",
  authMiddleware.authenticate,
  reviewControllers.deleteReply
);

// Get reviews for a specific user
// GET request to /user/:userId
router.get(
  "/user/:userId",
  authMiddleware.authenticate,
  reviewControllers.getReviews
);

/**
 * Export router object
 */
export default router;
