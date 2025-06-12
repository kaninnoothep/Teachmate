/**
 * Import modules
 */
import mongoose from "mongoose";

/**
 * Define user model for database
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
 * Export education model
 */
export default mongoose.model("Session", sessionSchema);
