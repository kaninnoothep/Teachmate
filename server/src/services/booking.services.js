import User from "../models/users.model.js";
import responses from "../utils/response.js";
import Booking from "../models/booking.model.js";
import { calculateDuration } from "../utils/calculateDuration.js";

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

  const tutor = await User.findById(tutorId);
  if (!tutor) {
    return responses.buildFailureResponse("Tutor not found", 404);
  }

  const availability = tutor.availability.find((av) =>
    av.date.toISOString().startsWith(date)
  );
  if (!availability) {
    return responses.buildFailureResponse("No availability on this date", 400);
  }

  const allSlots = availability.slots;

  // Filter slots in range
  const selectedSlots = allSlots.filter(
    (slot) => slot.startTime >= startTime && slot.endTime <= endTime
  );
  const expectedDuration = calculateDuration(startTime, endTime);
  if (selectedSlots.length !== expectedDuration) {
    return responses.buildFailureResponse(
      "Slots are not continuous or partially booked",
      400
    );
  }

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
  await tutor.save();

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

async function cancelBooking(user, bookingId) {
  const booking = await Booking.findById(bookingId);
  if (!booking) return responses.buildFailureResponse("Booking not found", 404);

  if (booking.student.toString() !== user.id)
    return responses.buildFailureResponse("Not authorized", 403);

  const tutor = await User.findById(booking.tutor);
  const availability = tutor.availability.find((av) =>
    av.date.toISOString().startsWith(booking.date.toISOString().split("T")[0])
  );

  if (availability) {
    const { startTime, endTime } = booking;
    availability.slots.forEach((slot) => {
      if (slot.startTime >= startTime && slot.endTime <= endTime) {
        slot.isBooked = false;
      }
    });
    await tutor.save();
  }

  await booking.deleteOne();

  return responses.buildSuccessResponse(
    "Booking cancelled successfully",
    200,
    booking
  );
}

async function getMyBookings(user, status) {
  const query = {};
  if (user.role === "tutor") {
    query.tutor = user._id;
  } else {
    query.student = user._id;
  }

  const now = new Date();
  const currentTime = now.toISOString().slice(11, 16); // "HH:mm" (UTC-safe)

  const startOfToday = new Date(now);
  startOfToday.setUTCHours(0, 0, 0, 0);

  const endOfToday = new Date(now);
  endOfToday.setUTCHours(23, 59, 59, 999);

  if (status === "active") {
    query.$or = [
      { date: { $gt: endOfToday } }, // Future days
      {
        date: { $gte: startOfToday, $lte: endOfToday },
        endTime: { $gt: currentTime }, // Today, still running
      },
    ];
  } else if (status === "inactive") {
    query.$or = [
      { date: { $lt: startOfToday } }, // Past days
      {
        date: { $gte: startOfToday, $lte: endOfToday },
        endTime: { $lte: currentTime }, // Today, already ended
      },
    ];
  }
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

export default {
  createBooking,
  cancelBooking,
  getMyBookings,
};
