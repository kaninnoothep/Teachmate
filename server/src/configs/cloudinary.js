/**
 * Import Modules
 */
import { v2 as cloudinary } from "cloudinary";

/**
 * connectCloudinary - Configures Cloudinary with environment variables
 *
 * @returns {void}
 */
const connectCloudinary = async () => {
  // Set Cloudinary configuration using env variables
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });
};

/**
 * Export the function
 */
export default connectCloudinary;
