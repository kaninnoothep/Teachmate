/**
 * Import modules
 */
import mongoose from "mongoose";

/**
 * Define user model for database
 */
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "tutor"],
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    country: {
      id: { type: Number },
      name: { type: String },
      emoji: { type: String },
      hasStates: { type: Boolean },
      latitude: String,
      longitude: String,
    },
    state: {
      id: { type: Number },
      name: { type: String },
      hasCities: { type: Boolean },
      latitude: String,
      longitude: String,
    },
    city: {
      id: { type: Number },
      name: { type: String },
      latitude: String,
      longitude: String,
    },
    postalCode: {
      type: String,
      required: false,
    },
    hourlyRate: {
      type: String,
      required: false,
    },
    about: {
      type: String,
      required: false,
    },
    availability: [
      {
        date: Date,
        slots: [
          {
            startTime: String,
            endTime: String,
            isBooked: { type: Boolean, default: false },
          },
        ],
      },
    ],
    preferredLocations: {
      publicPlace: { type: Boolean, default: false },
      tutorPlace: { type: Boolean, default: false },
      online: { type: Boolean, default: false },
    },
    education: [{ type: mongoose.Schema.Types.ObjectId, ref: "Education" }],
    experience: [{ type: mongoose.Schema.Types.ObjectId, ref: "Experience" }],
  },
  {
    timestamps: true,
  }
);

/**
 * Export user model
 */
export default mongoose.model("User", userSchema);
