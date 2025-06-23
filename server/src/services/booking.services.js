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

  // Create matching UTC date boundaries
  const todayUTC = new Date();
  todayUTC.setUTCHours(0, 0, 0, 0); // Today at UTC midnight

  const tomorrowUTC = new Date(todayUTC);
  tomorrowUTC.setUTCDate(tomorrowUTC.getUTCDate() + 1); // Tomorrow at UTC midnight

  // Current time in HH:MM format (local time for comparison with stored times)
  const currentTime =
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0");

  if (status === "active") {
    query.$or = [
      // Future dates (after today)
      { date: { $gte: tomorrowUTC } },
      // Today's bookings where session hasn't ended yet
      {
        date: { $gte: todayUTC, $lt: tomorrowUTC },
        endTime: { $gt: currentTime },
      },
    ];
  } else if (status === "inactive") {
    query.$or = [
      // Past dates (before today)
      { date: { $lt: todayUTC } },
      // Today's bookings where session has ended
      {
        date: { $gte: todayUTC, $lt: tomorrowUTC },
        endTime: { $lte: currentTime },
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
