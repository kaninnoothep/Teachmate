/**
 * Import Modules
 */
import { GET_BOOKINGS_API_KEY } from "@/services/constants";
import { useApiGet } from "@/services/hooks/useApiGet";

/**
 * useBookingsQuery - Custom hook to fetch bookings
 *
 * @param {*} options - Additional query options
 * @returns {object} - Bookings data and query status
 */
export const useBookingsQuery = (status, options) => {
  const { data, ...rest } = useApiGet(
    [GET_BOOKINGS_API_KEY, { status }],
    options
  );

  return {
    ...rest,
    bookings: data?.data ?? [],
  };
};
