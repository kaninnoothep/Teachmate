/**
 * Import Modules
 */
import { GET_BOOKINGS_CALENDAR_API_KEY } from "@/services/constants";
import { useApiGet } from "@/services/hooks/useApiGet";

/**
 * Helper function to get the first day of the month for API call
 * @param {string} date - Date in YYYY-MM-DD
 * @returns {string} - First day of month in YYYY-MM-DD format
 */
const getMonthStartDate = (date) => {
  const [year, month] = date.split("-");
  return `${year}-${month}-01T00:00`;
};

/**
 * useBookingsCalendarQuery - Custom hook to fetch bookings for calendar
 *
 * @param {*} options - Additional query options
 * @returns {object} - Bookings data
 */
export const useBookingsCalendarQuery = (selectedDate, options) => {
  let apiDate = getMonthStartDate(selectedDate);

  const { data, ...rest } = useApiGet(
    [GET_BOOKINGS_CALENDAR_API_KEY, { date: apiDate }],
    options
  );

  return {
    ...rest,
    bookings: data?.data?.bookings ?? {},
    markedDates: data?.data?.markedDates ?? {},
    dateRange: data?.data?.dateRange ?? {},
  };
};
