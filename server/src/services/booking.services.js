/**
 * Import Modules
 */
import User from "../models/users.model.js";
import responses from "../utils/response.js";
import Booking from "../models/booking.model.js";
import { calculateDuration } from "../utils/calculateDuration.js";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addWeeks,
  format,
} from "date-fns";

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
  const duration = calculateDuration(startTime, endTime);

  // Check if the number of slots matches the expected duration
  if (selectedSlots.length !== duration) {
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
    totalHours: duration,
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
export async function rejectBooking(user, bookingId, rejectNote) {
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
  booking.cancelledBy = user.role;
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
async function cancelBooking(user, bookingId, cancelNote) {
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
  booking.cancelledBy = user.role;
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
  let sortOption = { date: 1, startTime: 1 }; // default: upcoming

  if (["rejected", "cancelled"].includes(status)) {
    sortOption = { updatedAt: -1 };
  } else if (["expired", "finished"].includes(status)) {
    sortOption = { date: -1, startTime: -1 };
  }

  // Fetch bookings and populate related fields
  const bookings = await Booking.find(query)
    .populate("student", "-password")
    .populate("tutor", "-password")
    .populate("session")
    .sort(sortOption);

  return responses.buildSuccessResponse(
    "Bookings fetched successfully",
    200,
    bookings
  );
}

/**
 * getBooking - Get a specific booking by ID
 *
 * @param {Object} user - Logged-in user
 * @param {string} bookingId - ID of the booking to retrieve
 * @returns {Object} Response with booking info or error
 */
async function getBooking(user, bookingId) {
  // Find booking by ID and populate related fields
  const booking = await Booking.findById(bookingId)
    .populate("student", "-password")
    .populate("tutor", "-password")
    .populate("session");

  if (!booking) {
    return responses.buildFailureResponse("Booking not found", 404);
  }

  // Check if user has permission to view this booking
  // User can only view bookings where they are either the tutor or student
  const isAuthorized =
    booking.tutor._id.toString() === user._id.toString() ||
    booking.student._id.toString() === user._id.toString();

  if (!isAuthorized) {
    return responses.buildFailureResponse(
      "You don't have permission to view this booking",
      403
    );
  }

  return responses.buildSuccessResponse(
    "Booking fetched successfully",
    200,
    booking
  );
}

/**
 * getCalendarBookings - Get bookings for calendar view (3 months range)
 * Only returns confirmed and finished bookings for calendar display
 *
 * @param {Object} user - Logged-in user
 * @param {string} selectedDate - Selected date in YYYY-MM-DD format
 * @returns {Object} Response with bookings grouped by date
 */
async function getCalendarBookings(user, selectedDate) {
  // Parse the selected date or use current date
  const baseDate = selectedDate ? new Date(selectedDate) : new Date();

  // Calculate date range
  // First day of previous month
  const startDate = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth() - 1,
    1
  );

  // Last day of next month
  const endDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + 2, 0);

  const query = {
    date: {
      $gte: startDate,
      $lte: endDate,
    },
    status: { $in: ["confirmed", "finished"] }, // Only confirmed and finished bookings
  };

  // Filter by user role (tutor or student)
  if (user.role === "tutor") {
    query.tutor = user._id;
  } else {
    query.student = user._id;
  }

  // Fetch bookings and populate related fields
  const bookings = await Booking.find(query)
    .populate("student", "firstName lastName image")
    .populate("tutor", "firstName lastName image")
    .populate("session", "subject")
    .sort({ date: 1, startTime: 1 });

  // Group bookings by date
  const groupedBookings = {};
  const markedDates = {};

  bookings.forEach((booking) => {
    const dateKey = booking.date.toISOString().split("T")[0];

    if (!groupedBookings[dateKey]) {
      groupedBookings[dateKey] = [];
    }

    groupedBookings[dateKey].push(booking);
    markedDates[dateKey] = { marked: true };
  });

  return responses.buildSuccessResponse(
    "Calendar bookings fetched successfully",
    200,
    {
      bookings: groupedBookings,
      markedDates: markedDates,
      dateRange: {
        start: startDate.toISOString().split("T")[0],
        end: endDate.toISOString().split("T")[0],
      },
    }
  );
}

export async function getWeeklyBookingHours(user, dateStr) {
  const date = dateStr ? new Date(dateStr) : new Date();
  const start = startOfWeek(date, { weekStartsOn: 0 }); // Sunday
  const end = endOfWeek(date, { weekStartsOn: 0 }); // Saturday

  const query = {
    date: { $gte: start, $lte: end },
    status: { $in: ["finished"] },
    [user.role]: user._id,
  };

  const bookings = await Booking.find(query);

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const result = dayLabels.map((label) => ({ label, value: 0 }));

  bookings.forEach((b) => {
    const dayIndex = new Date(b.date).getUTCDay(); // 0 = Sun ... 6 = Sat
    result[dayIndex].value += b.totalHours;
  });

  return responses.buildSuccessResponse("Weekly hours", 200, {
    data: result,
    range: `${format(start, "MMM d, yyyy")} - ${format(end, "MMM d, yyyy")}`,
  });
}

async function getMonthlyBookingHours(user, dateStr) {
  const date = dateStr ? new Date(dateStr) : new Date();
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const firstWeekStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const lastWeekEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const query = {
    date: { $gte: firstWeekStart, $lte: lastWeekEnd },
    status: { $in: ["finished"] },
    [user.role]: user._id,
  };

  const bookings = await Booking.find(query);

  const weeklyData = [];
  let cursor = new Date(firstWeekStart);

  while (cursor <= lastWeekEnd) {
    const weekStart = new Date(cursor);
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });

    const weekTotal = bookings
      .filter((b) => b.date >= weekStart && b.date <= weekEnd)
      .reduce((sum, b) => sum + b.totalHours, 0);

    weeklyData.push({
      label: format(weekStart, "MMM d"),
      value: weekTotal,
    });

    cursor = addWeeks(cursor, 1);
  }

  return responses.buildSuccessResponse("Monthly hours", 200, {
    data: weeklyData,
    subtitle: format(date, "MMM yyyy"),
  });
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
  getBooking,
  getCalendarBookings,
  getWeeklyBookingHours,
  getMonthlyBookingHours,
};
