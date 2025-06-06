/**
 * Import Modules
 */
import axios from "axios";

/**
 * handleApiError - Function to handle errors fron the API
 * 
 * @param {Object} error  - Error object
 */
export const handleApiError = (error) => {
  if (axios.isAxiosError(error)) {
    throw error.response?.data || new Error("An unknown error occurred");
  } else {
    throw new Error("An unknown error occurred");
  }
};
