/**
 * Import Modules
 */
import { BOOKING_API_KEY, GET_BOOKINGS_API_KEY } from "@/services/constants";
import { apiRequest } from "@/services/helpers/apiRequest";
import { useApiSend } from "@/services/hooks/useApiSend";

// Cancel booking Request
const cancelBookingRequest = (payload) => {
  const { bookingId, ...data } = payload;
  apiRequest(`${BOOKING_API_KEY}/${bookingId}/cancel`, "POST", data);
};

/**
 * useCancelBookingMutation - Custom hook to handle Cancel Booking mutation
 *
 * @param {*} options - Mutation options
 * @returns useMutation result
 */
export const useCancelBookingMutation = (options) =>
  useApiSend(cancelBookingRequest, [GET_BOOKINGS_API_KEY], options);
