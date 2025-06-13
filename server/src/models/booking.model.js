/**
 * Import modules
 */
import mongoose from "mongoose";

/**
 * Define user model for database
 */
const bookingSchema = mongoose.Schema(
  {
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    preferredLocation: {
      type: String,
      enum: ["publicPlace", "tutorPlace", "online"],
      required: true,
    },
    note: { type: String },
  },
  {
    timestamps: true,
  }
);
/**
 * Export user model
 */
export default mongoose.model("Booking", bookingSchema);
