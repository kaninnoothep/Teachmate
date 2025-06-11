/**
 * Import Modules
 */
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./configs/database.js";
import userRouter from "./routes/user.route.js";
import connectCloudinary from "./configs/cloudinary.js";
dotenv.config();

/**
 * Define Variables to setup server
 */
const PORT = process.env.PORT || 5050;
const app = express();
connectDB(process.env.ATLAS_URI);
connectCloudinary();

/**
 * Specify features to be enabled by the express server
 */
app.use(cors());
app.use(express.json());
app.use("/api/user", userRouter);

/**
 * Start the server
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
