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

/**
 * cancelBooking - Cancel an existing booking
 *
 * @param {Object} user - Logged-in student user
 * @param {string} bookingId - ID of the booking to cancel
 * @returns {Object} Response indicating success or failure
 */
async function cancelBooking(user, bookingId) {
  // Find booking by ID
  const booking = await Booking.findById(bookingId);
  if (!booking) return responses.buildFailureResponse("Booking not found", 404);

  // Only the student who booked can cancel it
  if (booking.student.toString() !== user.id)
    return responses.buildFailureResponse("Not authorized", 403);

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

  // Delete booking from database
  await booking.deleteOne();

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
 * @param {string} status - 'active' or 'inactive' bookings
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

  const now = new Date();

  // Define today's date in UTC, starting at midnight
  const todayUTC = new Date();
  todayUTC.setUTCHours(0, 0, 0, 0); // Today at UTC midnight

  // Define tomorrow's date in UTC
  const tomorrowUTC = new Date(todayUTC);
  tomorrowUTC.setUTCDate(tomorrowUTC.getUTCDate() + 1); // Tomorrow at UTC midnight

  // Get current time in HH:MM format (local time for comparison with stored times)
  const currentTime =
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0");

  // Filter based on booking status
  if (status === "active") {
    query.$or = [
      // Bookings after today
      { date: { $gte: tomorrowUTC } },
      // Bookings today that haven't ended yet
      {
        date: { $gte: todayUTC, $lt: tomorrowUTC },
        endTime: { $gt: currentTime },
      },
    ];
  } else if (status === "inactive") {
    query.$or = [
      // Bookings before today
      { date: { $lt: todayUTC } },
      // Bookings today that already ended
      {
        date: { $gte: todayUTC, $lt: tomorrowUTC },
        endTime: { $lte: currentTime },
      },
    ];
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
  cancelBooking,
  getMyBookings,
};
