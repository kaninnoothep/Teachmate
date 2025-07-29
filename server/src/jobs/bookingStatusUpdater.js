// jobs/bookingStatusUpdater.js
import cron from "node-cron";
import Booking from "../models/booking.model.js";

function runBookingStatusCron() {
  cron.schedule("* * * * *", async () => {
    console.log("===========================");
    console.log("Running booking status cron job...");

    const now = new Date();

    const bookings = await Booking.find({
      status: { $in: ["confirmed", "pending"] },
    });

    const updates = bookings.map(async (booking) => {
      const bookingDateTime = new Date(
        `${booking.date.toISOString().split("T")[0]}T${booking.endTime}`
      );

      console.log("booking.status", booking.status);
      console.log("now", now);
      console.log("booking.endTime", booking.endTime);
      console.log("bookingDateTime", bookingDateTime);

      if (booking.status === "confirmed" && now > bookingDateTime) {
        booking.status = "finished";
        booking.finishedAt = now;
        await booking.save();
      }

      if (booking.status === "pending" && now > bookingDateTime) {
        booking.status = "expired";
        await booking.save();
      }
    });

    await Promise.all(updates);
    console.log("Booking statuses updated.");
  });
}

export default runBookingStatusCron;
