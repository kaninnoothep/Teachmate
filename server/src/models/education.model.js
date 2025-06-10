/**
 * Import modules
 */
import mongoose from "mongoose";

/**
 * Define user model for database
 */
const educationSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    school: String,
    degree: String,
    fieldOfStudy: String,
    startDate: Date,
    endDate: Date,
    description: String,
  },
  {
    timestamps: true,
  }
);

/**
 * Export education model
 */
export default mongoose.model("Education", educationSchema);
