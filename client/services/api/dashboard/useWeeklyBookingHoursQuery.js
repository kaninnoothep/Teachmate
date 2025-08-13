/**
 * Import Modules
 */
import { GET_WEEKLY_BOOKING_HOURS_API_KEY } from "@/services/constants";
import { useApiGet } from "@/services/hooks/useApiGet";
import dayjs from "dayjs";

/**
 * useWeeklyBookingHoursQuery - Custom hook to fetch weekly booking hours for dashboard
 *
 * @param {*} options - Additional query options
 * @returns {object} - Booking hours data
 */
export const useWeeklyBookingHoursQuery = (date, options) => {
  let apiDate = `${dayjs(date).format("YYYY-MM-DD")}T00:00`;

  const { data, ...rest } = useApiGet(
    [GET_WEEKLY_BOOKING_HOURS_API_KEY, { date: apiDate }],
    options
  );

  return {
    ...rest,
    data: data?.data?.data ?? [],
    range: data?.data?.range ?? "",
  };
};
