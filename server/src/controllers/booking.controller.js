/**
 * Import modules
 */
import bookingServices from "../services/booking.services.js";

async function createBooking(req, res) {
  try {
    const response = await bookingServices.createBooking(req.user, req.body);
    res.status(response.statusCode).json(response);
  } catch {
    res
      .status(500)
      .json({ message: "Unable to book the tutor", status: "failure" });
  }
}

async function cancelBooking(req, res) {
  try {
    const response = await bookingServices.cancelBooking(
      req.user,
      req.params.bookingId
    );
    res.status(response.statusCode).json(response);
  } catch {
    res
      .status(500)
      .json({ message: "Unable to cancel booking", status: "failure" });
  }
}

async function getMyBookings(req, res) {
  try {
    const response = await bookingServices.getMyBookings(
      req.user,
      req.query.status // "active" | "inactive" | undefined
    );
    res.status(response.statusCode).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unable to fetch bookings", status: "failure" });
  }
}

export default {
  createBooking,
  cancelBooking,
  getMyBookings,
};
