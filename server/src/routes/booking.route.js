/**
 * Import Modules
 */
import express from "express";
import bookingControllers from "../controllers/booking.controller.js";
import authMiddleware from "../middlewares/auth.js";

// Define Router object for all /booking routes
const router = express.Router();

// Create booking (student only)
router.post(
  "/",
  authMiddleware.studentAuthenticate,
  bookingControllers.createBooking
);

// Get current user's bookings
router.get(
  "/me",
  authMiddleware.authenticate,
  bookingControllers.getMyBookings
);

// Cancel booking by ID (students only)
router.delete(
  "/:bookingId",
  authMiddleware.studentAuthenticate,
  bookingControllers.cancelBooking
);

/**
 * Export router object
 */
export default router;
