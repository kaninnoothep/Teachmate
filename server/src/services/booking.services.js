/**
 * Import Modules
 */
import User from "../models/users.model.js";
import responses from "../utils/response.js";
import Booking from "../models/booking.model.js";
import { calculateDuration } from "../utils/calculateDuration.js";

/**
 * createBooking - Create a new booking for a tutor session
 *
 * @param {Object} user - Logged-in student user
 * @param {Object} data - Booking details
 * @returns {Object} Response with booking info or error
 */
async function createBooking(user, data) {
  const {
    tutorId,
    sessionId,
    date,
    startTime,
    endTime,
    preferredLocation,
    note,
  } = data;
  const studentId = user._id;

  // Check if tutor exists
  const tutor = await User.findById(tutorId);
  if (!tutor) {
    return responses.buildFailureResponse("Tutor not found", 404);
  }

  // Find availability for the requested date
  const availability = tutor.availability.find((av) =>
    av.date.toISOString().startsWith(date)
  );
  if (!availability) {
    return responses.buildFailureResponse("No availability on this date", 400);
  }

  const allSlots = availability.slots;

  // Filter slots in requested time range
  const selectedSlots = allSlots.filter(
    (slot) => slot.startTime >= startTime && slot.endTime <= endTime
  );

  // Calculate how many slots should be selected based on duration
  const expectedDuration = calculateDuration(startTime, endTime);

  // Check if the number of slots matches the expected duration
  if (selectedSlots.length !== expectedDuration) {
    return responses.buildFailureResponse(
      "Slots are not continuous or partially booked",
      400
    );
  }

  // Make sure all selected slots are available
  const allAvailable = selectedSlots.every((slot) => !slot.isBooked);
  if (!allAvailable) {
    return responses.buildFailureResponse(
      "One or more slots are already booked",
      400
    );
  }

  // Mark slots as booked
  for (const slot of selectedSlots) {
    slot.isBooked = true;
  }
  await tutor.save(); // Save updated availability

  // Create booking entry in the database
  const booking = await Booking.create({
    tutor: tutorId,
    student: studentId,
    session: sessionId,
    date,
    startTime,
    endTime,
    preferredLocation,
    note,
  });

  return responses.buildSuccessResponse(
    "Booking created successfully",
    201,
    booking
  );
}

// Confirm booking
export async function confirmBooking(bookingId) {
  const booking = await Booking.findById(bookingId);
  if (!booking) return responses.buildFailureResponse("Booking not found", 404);
  if (booking.status !== "pending")
    return responses.buildFailureResponse(
      "Only pending bookings can be confirmed",
      403
    );

  booking.status = "confirmed";
  booking.confirmedAt = new Date();
  await booking.save();

  return responses.buildSuccessResponse(
    "Booking confirmed successfully",
    200,
    booking
  );
}

// Reject booking
export async function rejectBooking(bookingId, rejectNote) {
  const booking = await Booking.findById(bookingId);
  if (!booking) return responses.buildFailureResponse("Booking not found", 404);
  if (booking.status !== "pending")
    return responses.buildFailureResponse(
      "Only pending bookings can be rejected",
      403
    );

  // Find tutor to update their availability
  const tutor = await User.findById(booking.tutor);
  const availability = tutor.availability.find((av) =>
    av.date.toISOString().startsWith(booking.date.toISOString().split("T")[0])
  );

  if (availability) {
    const { startTime, endTime } = booking;
    // Unbook the time slots in the availability
    availability.slots.forEach((slot) => {
      if (slot.startTime >= startTime && slot.endTime <= endTime) {
        slot.isBooked = false;
      }
    });
    await tutor.save();
  }

  booking.status = "rejected";
  if (rejectNote) booking.cancelNote = rejectNote;
  await booking.save();

  return responses.buildSuccessResponse(
    "Booking reject successfully",
    200,
    booking
  );
}

/**
 * cancelBooking - Cancel an existing booking
 *
 * @param {string} bookingId - ID of the booking to cancel
 * @returns {Object} Response indicating success or failure
 */
async function cancelBooking(bookingId, cancelNote) {
  // Find booking by ID
  const booking = await Booking.findById(bookingId);
  if (!booking) return responses.buildFailureResponse("Booking not found", 404);
  if (["cancelled", "rejected", "finished"].includes(booking.status))
    return responses.buildFailureResponse("Cannot cancel this booking", 403);

  // Find tutor to update their availability
  const tutor = await User.findById(booking.tutor);
  const availability = tutor.availability.find((av) =>
    av.date.toISOString().startsWith(booking.date.toISOString().split("T")[0])
  );

  if (availability) {
    const { startTime, endTime } = booking;
    // Unbook the time slots in the availability
    availability.slots.forEach((slot) => {
      if (slot.startTime >= startTime && slot.endTime <= endTime) {
        slot.isBooked = false;
      }
    });
    await tutor.save();
  }

  booking.status = "cancelled";
  if (cancelNote) booking.cancelNote = cancelNote;
  await booking.save();

  return responses.buildSuccessResponse(
    "Booking cancelled successfully",
    200,
    booking
  );
}

/**
 * getMyBookings - Get a user's bookings (tutor or student), filtered by status
 *
 * @param {Object} user - Logged-in user
 * @param {string} status - Booking status
 * @returns {Object} List of bookings
 */
async function getMyBookings(user, status) {
  const query = {};

  // Filter by user role (tutor or student)
  if (user.role === "tutor") {
    query.tutor = user._id;
  } else {
    query.student = user._id;
  }

  // Filter by status
  if (
    [
      "pending",
      "confirmed",
      "rejected",
      "cancelled",
      "finished",
      "expired",
    ].includes(status)
  ) {
    query.status = status;
  }

  // Fetch bookings and populate related fields
  const bookings = await Booking.find(query)
    .populate("student", "-password")
    .populate("tutor", "-password")
    .populate("session")
    .sort({ date: 1, startTime: 1 });

  return responses.buildSuccessResponse(
    "Bookings fetched successfully",
    200,
    bookings
  );
}

/**
 * Export all functions
 */
export default {
  createBooking,
  confirmBooking,
  rejectBooking,
  cancelBooking,
  getMyBookings,
};
