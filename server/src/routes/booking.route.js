/**
 * Import Modules
 */
import express from "express";
import bookingControllers from "../controllers/booking.controller.js";
import authMiddleware from "../middlewares/auth.js";

// Define Router object for all /booking routes
const router = express.Router();

// Create booking (student only)
// POST request to /
router.post(
  "/",
  authMiddleware.studentAuthenticate,
  bookingControllers.createBooking
);

// Get current user's bookings
// GET request to /me
router.get(
  "/me",
  authMiddleware.authenticate,
  bookingControllers.getMyBookings
);

// Get calendar bookings (3 months range)
// GET request to /calendar
router.get(
  "/calendar",
  authMiddleware.authenticate,
  bookingControllers.getCalendarBookings
);

// Get a booking by ID
// GET request to /:bookingId
router.get(
  "/:bookingId",
  authMiddleware.authenticate,
  bookingControllers.getBooking
);

// Confirm booking by ID
// POST request to /:bookingId/confirm
router.post(
  "/:bookingId/confirm",
  authMiddleware.tutorAuthenticate,
  bookingControllers.confirmBooking
);

// Reject booking by ID
// POST request to /:bookingId/reject
router.post(
  "/:bookingId/reject",
  authMiddleware.tutorAuthenticate,
  bookingControllers.rejectBooking
);

// Cancel booking by ID
// POST request to /:bookingId/cancel
router.post(
  "/:bookingId/cancel",
  authMiddleware.authenticate,
  bookingControllers.cancelBooking
);

// Get weekly booking hours
// GET request to /analytics/weekly
router.get(
  "/analytics/weekly",
  authMiddleware.authenticate,
  bookingControllers.getWeeklyBookingHours
);

// Get monthly booking hours
// GET request to /analytics/monthly
router.get(
  "/analytics/monthly",
  authMiddleware.authenticate,
  bookingControllers.getMonthlyBookingHours
);

/**
 * Export router object
 */
export default router;
