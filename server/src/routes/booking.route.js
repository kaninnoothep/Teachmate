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

router.post(
  "/:bookingId/confirm",
  authMiddleware.tutorAuthenticate,
  bookingControllers.confirmBooking
);

router.post(
  "/:bookingId/reject",
  authMiddleware.tutorAuthenticate,
  bookingControllers.rejectBooking
);

// Cancel booking by ID (students only)
// DELETE request to /:bookingId
router.post(
  "/:bookingId/cancel",
  authMiddleware.authenticate,
  bookingControllers.cancelBooking
);

/**
 * Export router object
 */
export default router;
