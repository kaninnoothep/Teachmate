/**
 * Import Modules
 */
import { BOOKING_API_KEY } from "@/services/constants";
import { useApiGet } from "@/services/hooks/useApiGet";

/**
 * useBookingQuery - Custom hook to fetch bookings
 *
 * @param {string} bookingId - The booking ID to fetch
 * @param {*} options - Additional query options
 * @returns {object} - Booking data
 */
export const useBookingQuery = (bookingId, options) => {
  const { data, ...rest } = useApiGet(
    [`${BOOKING_API_KEY}/${bookingId}`],
    options
  );

  return {
    ...rest,
    booking: data?.data ?? {},
  };
};
