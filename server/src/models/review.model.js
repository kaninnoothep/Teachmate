/**
 * Import modules
 */
import mongoose from "mongoose";

/**
 * Define review model for database
 */
const reviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    title: String,
    reviewMessage: String,
    reply: {
      type: {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        replyMessage: String,
        createdAt: Date,
      },
      default: null,
    },
  },
  { timestamps: true }
);

/**
 * Export review model
 */
export default mongoose.model("Review", reviewSchema);
