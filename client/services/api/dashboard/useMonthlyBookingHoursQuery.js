/**
 * Import Modules
 */
import { GET_MONTHLY_BOOKING_HOURS_API_KEY } from "@/services/constants";
import { useApiGet } from "@/services/hooks/useApiGet";

/**
 * useMonthlyBookingHoursQuery - Custom hook to fetch monthly booking hours for dashboard
 *
 * @param {*} options - Additional query options
 * @returns {object} - Booking hours data
 */
export const useMonthlyBookingHoursQuery = (date, options) => {
  let apiDate = `${date.toISOString().split("T")[0]}T00:00`;

  const { data, ...rest } = useApiGet(
    [GET_MONTHLY_BOOKING_HOURS_API_KEY, { date: apiDate }],
    options
  );

  return {
    ...rest,
    data: data?.data?.data ?? [],
    monthLabel: data?.data?.monthLabel ?? "",
  };
};
