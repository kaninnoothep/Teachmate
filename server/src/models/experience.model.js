/**
 * Import modules
 */
import mongoose from "mongoose";

/**
 * Define user model for database
 */
const experienceSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    company: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

/**
 * Export education model
 */
export default mongoose.model("Experience", experienceSchema);
