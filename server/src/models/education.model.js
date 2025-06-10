/**
 * Import modules
 */
import mongoose from "mongoose";

/**
 * Define user model for database
 */
const educationSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    school: { type: String, required: true },
    degree: { type: String },
    fieldOfStudy: { type: String },
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
export default mongoose.model("Education", educationSchema);
