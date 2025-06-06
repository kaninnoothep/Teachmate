/**
 * Import modules
 */
import mongoose from "mongoose";

/**
 * Define function to connect to DB
 * @param {string} ATLAS_URI - Environment variable
 */
const connectDB = async (ATLAS_URI) => {
  try {
    await mongoose.connect(ATLAS_URI);
    console.log(`MongoDB Connected Succesfully`);
  } catch (error) {
    console.log("DB connection error: ", error);
    process.exit(1);
  }
};

/**
 * Export the function
 */
export default connectDB;
