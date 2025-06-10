/**
 * Import modules
 */
import mongoose from "mongoose";

/**
 * Define user model for database
 */
const experienceSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    organization: String,
    position: String,
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
export default mongoose.model("Exerrience", experienceSchema);
