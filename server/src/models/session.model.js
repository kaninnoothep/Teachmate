/**
 * Import modules
 */
import mongoose from "mongoose";

/**
 * Define session model for database
 */
const sessionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    estimatedDuration: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

/**
 * Export session model
 */
export default mongoose.model("Session", sessionSchema);
