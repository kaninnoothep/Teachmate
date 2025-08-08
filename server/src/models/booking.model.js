/**
 * Import modules
 */
import mongoose from "mongoose";

/**
 * Define booking model for database
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
    totalHours: {
      type: Number,
      required: true,
    },
    preferredLocation: {
      type: String,
      enum: ["publicPlace", "tutorPlace", "online", ""],
      required: false,
    },
    note: { type: String },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "rejected",
        "cancelled",
        "finished",
        "expired",
      ],
      default: "pending",
    },
    cancelNote: { type: String },
    cancelledBy: { type: String },
    confirmedAt: { type: Date },
    finishedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

/**
 * Export booking model
 */
export default mongoose.model("Booking", bookingSchema);
