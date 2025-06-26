/**
 * Import modules
 */
import bookingServices from "../services/booking.services.js";

/**
 * createBooking - Create a new booking
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
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

/**
 * cancelBooking - Cancel an existing booking
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
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

/**
 * getMyBookings - Retrieve a user's bookings (tutor or student), filtered by status
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 */
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

/**
 * Export all functions
 */
export default {
  createBooking,
  cancelBooking,
  getMyBookings,
};
