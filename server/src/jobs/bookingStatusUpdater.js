/**
 * Import modules
 */
import cron from "node-cron";
import Booking from "../models/booking.model.js";

/**
 * Schedules and runs a cron job to update booking statuses
 *
 * - Checks all bookings with status "confirmed" or "pending"
 * - Marks "confirmed" bookings as "finished" if the end time has passed
 * - Marks "pending" bookings as "expired" if the end time has passed
 *
 * @function runBookingStatusCron
 * @returns {void}
 */
function runBookingStatusCron() {
  // Schedule a cron job to run
  cron.schedule("* * * * *", async () => {
    const now = new Date();

    // Find bookings that are either confirmed or pending
    const bookings = await Booking.find({
      status: { $in: ["confirmed", "pending"] },
    });

    // Process each booking
    const updates = bookings.map(async (booking) => {
      // Construct booking end datetime by combining booking date and endTime
      const bookingDateTime = new Date(
        `${booking.date.toISOString().split("T")[0]}T${booking.endTime}`
      );

      // Mark confirmed bookings as finished if past end time
      if (booking.status === "confirmed" && now > bookingDateTime) {
        booking.status = "finished";
        booking.finishedAt = now;
        await booking.save();
      }

      // Mark pending bookings as expired if past end time
      if (booking.status === "pending" && now > bookingDateTime) {
        booking.status = "expired";
        await booking.save();
      }
    });

    // Wait for all updates to finish
    await Promise.all(updates);
  });
}

// Export the cron job runner
export default runBookingStatusCron;
