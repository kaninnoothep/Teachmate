/**
 * Import Modules
 */
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./configs/database.js";
import userRouter from "./routes/user.route.js";
import bookingRouter from "./routes/booking.route.js";
import reviewRouter from "./routes/review.route.js";
import connectCloudinary from "./configs/cloudinary.js";
import runBookingStatusCron from "./jobs/bookingStatusUpdater.js";

/**
 * Load environment variables from .env file
 */
dotenv.config();

/**
 * Define Variables to setup server
 */
const PORT = process.env.PORT || 5050;
const app = express();

/**
 * Connect to MongoDB database and Cloudinary
 */
connectDB(process.env.ATLAS_URI);
connectCloudinary();

/**
 * Start the cron job that updates booking statuses automatically
 */
runBookingStatusCron();

/**
 * Middleware Setup
 * Enable CORS, JSON parsing, and define API routes
 */
app.use(cors());
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/review", reviewRouter);

/**
 * Start the server
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
