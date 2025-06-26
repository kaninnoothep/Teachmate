/**
 * Import Modules
 */
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc); // Enable UTC support in dayjs

/**
 * parseDateToPickerFormat - Convert ISO date string to picker-friendly format
 *
 * @param {string} isoDateString - ISO date string to convert
 * @returns {object|null} Object with year, month, and displayText, or null if input is invalid
 */
export const parseDateToPickerFormat = (isoDateString) => {
  // Return null if input is missing
  if (!isoDateString) return null;

  // Parse date using UTC mode
  const date = dayjs.utc(isoDateString);
  const year = date.format("YYYY");
  const month = date.format("MM");

  // Return formatted year, month, and a display text
  return {
    year,
    month,
    displayText: `${date.format("MMMM")} ${year}`,
  };
};
