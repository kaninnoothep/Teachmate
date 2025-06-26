/**
 * Import Modules
 */
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc); // Enable UTC support in dayjs

/**
 * formatDate - Convert a dateData object to an ISO date string
 *
 * @param {object} dateData - Object containing year and month
 * @returns {string|null} ISO date string or null if input is invalid
 */
export const formatDate = (dateData) => {
  // Return null if year or month is missing
  if (!dateData?.year || !dateData?.month) return null;

  // Create UTC date from year and month, then return ISO string
  return dayjs.utc(`${dateData.year}-${dateData.month}-01`).toISOString();
};
